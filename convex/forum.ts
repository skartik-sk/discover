import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper to check rate limit for forum posts
async function checkPostRateLimit(ctx: any, authorWallet: string): Promise<boolean> {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  
  const recentPosts = await ctx.db
    .query("forumPosts")
    .withIndex("by_author", (q) => q.eq("authorWallet", authorWallet))
    .filter((q: any) => q.gte(q.field("createdAt"), oneDayAgo))
    .collect();

  return recentPosts.length >= 2; // Max 2 posts per day
}

// Helper to check rate limit for comments
async function checkCommentRateLimit(ctx: any, authorWallet: string): Promise<boolean> {
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  
  const recentComments = await ctx.db
    .query("comments")
    .withIndex("by_author", (q) => q.eq("authorWallet", authorWallet))
    .filter((q: any) => q.gte(q.field("createdAt"), oneDayAgo))
    .collect();

  return recentComments.length >= 5; // Max 5 comments per day
}

// List all forum posts
export const listPosts = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, { category }) => {
    let posts;
    
    if (category) {
      posts = await ctx.db
        .query("forumPosts")
        .withIndex("by_category", (q) => q.eq("category", category))
        .collect();
    } else {
      posts = await ctx.db
        .query("forumPosts")
        .withIndex("by_created")
        .collect();
    }

    // Sort by creation date (newest first)
    return posts.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get single post with comments
export const getPost = query({
  args: { id: v.id("forumPosts") },
  handler: async (ctx, { id }) => {
    const post = await ctx.db.get(id);
    if (!post) return null;

    // Get comments for this post
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", id))
      .collect();

    // Sort comments by creation date (oldest first)
    const sortedComments = comments.sort((a, b) => a.createdAt - b.createdAt);

    return {
      ...post,
      commentsList: sortedComments.map((c) => ({
        id: c._id,
        author: c.authorName,
        avatar: c.authorAvatar,
        content: c.content,
        date: new Date(c.createdAt).toISOString(),
        likes: c.likeCount,
      })),
    };
  },
});

// Create new forum post (rate limited)
export const createPost = mutation({
  args: {
    authorWallet: v.string(),
    authorName: v.string(),
    authorAvatar: v.string(),
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    category: v.string(),
    coverImage: v.optional(v.string()),
    coverImageStorageId: v.optional(v.id("_storage")),
    readTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check rate limit
    const isRateLimited = await checkPostRateLimit(ctx, args.authorWallet);
    if (isRateLimited) {
      throw new Error("Rate limit exceeded. You can only create 2 posts per day.");
    }

    const postId = await ctx.db.insert("forumPosts", {
      ...args,
      likeCount: 0,
      commentCount: 0,
      createdAt: Date.now(),
    });

    return postId;
  },
});

// Toggle post like
export const togglePostLike = mutation({
  args: {
    postId: v.id("forumPosts"),
    userWallet: v.string(),
  },
  handler: async (ctx, { postId, userWallet }) => {
    // Check if user already liked
    const existing = await ctx.db
      .query("postLikes")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", postId).eq("userWallet", userWallet)
      )
      .first();

    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    if (existing) {
      // Remove like
      await ctx.db.delete(existing._id);
      await ctx.db.patch(postId, {
        likeCount: Math.max(0, post.likeCount - 1),
      });
      return { liked: false, count: Math.max(0, post.likeCount - 1) };
    } else {
      // Add like
      await ctx.db.insert("postLikes", {
        postId,
        userWallet,
        createdAt: Date.now(),
      });
      await ctx.db.patch(postId, {
        likeCount: post.likeCount + 1,
      });
      return { liked: true, count: post.likeCount + 1 };
    }
  },
});

// Add comment to post (rate limited)
export const addComment = mutation({
  args: {
    postId: v.id("forumPosts"),
    authorWallet: v.string(),
    authorName: v.string(),
    authorAvatar: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Check rate limit
    const isRateLimited = await checkCommentRateLimit(ctx, args.authorWallet);
    if (isRateLimited) {
      throw new Error("Rate limit exceeded. You can only create 5 comments per day.");
    }

    const { postId, ...commentData } = args;

    // Create comment
    const commentId = await ctx.db.insert("comments", {
      ...commentData,
      postId,
      likeCount: 0,
      createdAt: Date.now(),
    });

    // Update post comment count
    const post = await ctx.db.get(postId);
    if (post) {
      await ctx.db.patch(postId, {
        commentCount: post.commentCount + 1,
      });
    }

    return commentId;
  },
});

// Toggle comment like
export const toggleCommentLike = mutation({
  args: {
    commentId: v.id("comments"),
    userWallet: v.string(),
  },
  handler: async (ctx, { commentId, userWallet }) => {
    // Check if user already liked
    const existing = await ctx.db
      .query("commentLikes")
      .withIndex("by_comment_user", (q) =>
        q.eq("commentId", commentId).eq("userWallet", userWallet)
      )
      .first();

    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (existing) {
      // Remove like
      await ctx.db.delete(existing._id);
      await ctx.db.patch(commentId, {
        likeCount: Math.max(0, comment.likeCount - 1),
      });
      return { liked: false, count: Math.max(0, comment.likeCount - 1) };
    } else {
      // Add like
      await ctx.db.insert("commentLikes", {
        commentId,
        userWallet,
        createdAt: Date.now(),
      });
      await ctx.db.patch(commentId, {
        likeCount: comment.likeCount + 1,
      });
      return { liked: true, count: comment.likeCount + 1 };
    }
  },
});

// Get posts by user
export const getUserPosts = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, { walletAddress }) => {
    const posts = await ctx.db
      .query("forumPosts")
      .withIndex("by_author", (q) => q.eq("authorWallet", walletAddress))
      .collect();

    return posts.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Check if user has liked a post
export const hasLikedPost = query({
  args: {
    postId: v.id("forumPosts"),
    userWallet: v.string(),
  },
  handler: async (ctx, { postId, userWallet }) => {
    const like = await ctx.db
      .query("postLikes")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", postId).eq("userWallet", userWallet)
      )
      .first();

    return like !== null;
  },
});
