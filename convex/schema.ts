import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table (wallet-based auth)
  users: defineTable({
    walletAddress: v.string(),
    displayName: v.optional(v.string()),
    avatar: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
  }).index("by_wallet", ["walletAddress"]),

  // Projects table
  projects: defineTable({
    name: v.string(),
    tagline: v.string(),
    description: v.string(),
    logoStorageId: v.optional(v.id("_storage")),
    logo: v.string(), // URL fallback
    coverImageStorageId: v.optional(v.id("_storage")),
    coverImage: v.string(),
    category: v.string(), // DeFi, NFT, Gaming, DAO, Infrastructure, Social, AI
    tags: v.array(v.string()),
    chain: v.string(),
    launchDate: v.string(),
    verified: v.boolean(),
    featured: v.optional(v.boolean()),
    
    // Stats
    tvl: v.optional(v.string()),
    users: v.string(),
    transactions: v.string(),
    growth: v.number(),
    
    // Token info (optional)
    tokenSymbol: v.optional(v.string()),
    tokenAddress: v.optional(v.string()),
    tokenPrice: v.optional(v.string()),
    tokenMarketCap: v.optional(v.string()),
    tokenChange24h: v.optional(v.number()),
    
    // Links
    website: v.optional(v.string()),
    twitter: v.optional(v.string()),
    discord: v.optional(v.string()),
    github: v.optional(v.string()),
    auditUrl: v.optional(v.string()),
    
    // Owner (wallet address)
    ownerWallet: v.string(),
    
    // Aggregated counts (denormalized for performance)
    upvoteCount: v.number(),
    reviewCount: v.number(),
    averageRating: v.number(),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_chain", ["chain"])
    .index("by_featured", ["featured"])
    .index("by_owner", ["ownerWallet"])
    .searchIndex("search_projects", {
      searchField: "name",
      filterFields: ["category", "chain", "featured"],
    }),

  // Team members for projects
  teamMembers: defineTable({
    projectId: v.id("projects"),
    name: v.string(),
    role: v.string(),
    avatar: v.string(),
    avatarStorageId: v.optional(v.id("_storage")),
  }).index("by_project", ["projectId"]),

  // Screenshots for projects
  screenshots: defineTable({
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
    url: v.string(), // Fallback URL
    order: v.number(),
  }).index("by_project", ["projectId"]),

  // Upvotes (many-to-many: users <-> projects)
  upvotes: defineTable({
    projectId: v.id("projects"),
    userWallet: v.string(),
    createdAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_user", ["userWallet"])
    .index("by_project_user", ["projectId", "userWallet"]),

  // Reviews
  reviews: defineTable({
    projectId: v.id("projects"),
    userWallet: v.string(),
    userName: v.string(),
    userAvatar: v.string(),
    rating: v.number(), // 1-5
    comment: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_user", ["userWallet"])
    .index("by_project_user", ["projectId", "userWallet"]),

  // Forum posts
  forumPosts: defineTable({
    title: v.string(),
    excerpt: v.string(),
    content: v.string(),
    authorWallet: v.string(),
    authorName: v.string(),
    authorAvatar: v.string(),
    category: v.string(),
    coverImage: v.optional(v.string()),
    coverImageStorageId: v.optional(v.id("_storage")),
    readTime: v.optional(v.string()),
    createdAt: v.number(),
    
    // Denormalized counts
    likeCount: v.number(),
    commentCount: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_author", ["authorWallet"])
    .index("by_created", ["createdAt"]),

  // Forum post likes
  postLikes: defineTable({
    postId: v.id("forumPosts"),
    userWallet: v.string(),
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userWallet"])
    .index("by_post_user", ["postId", "userWallet"]),

  // Forum comments
  comments: defineTable({
    postId: v.id("forumPosts"),
    authorWallet: v.string(),
    authorName: v.string(),
    authorAvatar: v.string(),
    content: v.string(),
    createdAt: v.number(),
    likeCount: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorWallet"]),

  // Comment likes
  commentLikes: defineTable({
    commentId: v.id("comments"),
    userWallet: v.string(),
    createdAt: v.number(),
  })
    .index("by_comment", ["commentId"])
    .index("by_user", ["userWallet"])
    .index("by_comment_user", ["commentId", "userWallet"]),

  // Email subscriptions
  subscriptions: defineTable({
    email: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
});
