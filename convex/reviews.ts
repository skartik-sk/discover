import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all reviews for a project
export const getForProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect();

    return reviews
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((r) => ({
        id: r._id,
        user: r.userName,
        avatar: r.userAvatar,
        rating: r.rating,
        comment: r.comment,
        date: new Date(r.createdAt).toISOString(),
      }));
  },
});

// Add new review (1 per project per user)
export const add = mutation({
  args: {
    projectId: v.id("projects"),
    userWallet: v.string(),
    userName: v.string(),
    userAvatar: v.string(),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already reviewed this project
    const existing = await ctx.db
      .query("reviews")
      .withIndex("by_project_user", (q) =>
        q.eq("projectId", args.projectId).eq("userWallet", args.userWallet)
      )
      .first();

    if (existing) {
      throw new Error("You have already reviewed this project. Use update instead.");
    }

    // Create review
    const reviewId = await ctx.db.insert("reviews", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update project review count and average rating
    const project = await ctx.db.get(args.projectId);
    if (project) {
      const newReviewCount = project.reviewCount + 1;
      const newAverageRating =
        (project.averageRating * project.reviewCount + args.rating) / newReviewCount;

      await ctx.db.patch(args.projectId, {
        reviewCount: newReviewCount,
        averageRating: Math.round(newAverageRating * 10) / 10, // Round to 1 decimal
      });
    }

    return reviewId;
  },
});

// Update own review
export const update = mutation({
  args: {
    reviewId: v.id("reviews"),
    userWallet: v.string(),
    rating: v.optional(v.number()),
    comment: v.optional(v.string()),
  },
  handler: async (ctx, { reviewId, userWallet, rating, comment }) => {
    const review = await ctx.db.get(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.userWallet !== userWallet) {
      throw new Error("You can only update your own reviews");
    }

    const oldRating = review.rating;
    const newRating = rating ?? review.rating;

    await ctx.db.patch(reviewId, {
      ...(rating !== undefined && { rating }),
      ...(comment !== undefined && { comment }),
      updatedAt: Date.now(),
    });

    // Update project average rating if rating changed
    if (rating !== undefined && rating !== oldRating) {
      const project = await ctx.db.get(review.projectId);
      if (project && project.reviewCount > 0) {
        const newAverageRating =
          (project.averageRating * project.reviewCount - oldRating + newRating) /
          project.reviewCount;

        await ctx.db.patch(review.projectId, {
          averageRating: Math.round(newAverageRating * 10) / 10,
        });
      }
    }

    return reviewId;
  },
});

// Delete own review
export const deleteReview = mutation({
  args: {
    reviewId: v.id("reviews"),
    userWallet: v.string(),
  },
  handler: async (ctx, { reviewId, userWallet }) => {
    const review = await ctx.db.get(reviewId);

    if (!review) {
      throw new Error("Review not found");
    }

    if (review.userWallet !== userWallet) {
      throw new Error("You can only delete your own reviews");
    }

    await ctx.db.delete(reviewId);

    // Update project review count and average rating
    const project = await ctx.db.get(review.projectId);
    if (project && project.reviewCount > 0) {
      const newReviewCount = project.reviewCount - 1;
      let newAverageRating = 0;

      if (newReviewCount > 0) {
        newAverageRating =
          (project.averageRating * project.reviewCount - review.rating) / newReviewCount;
      }

      await ctx.db.patch(review.projectId, {
        reviewCount: newReviewCount,
        averageRating: Math.round(newAverageRating * 10) / 10,
      });
    }

    return reviewId;
  },
});

// Get reviews by user
export const getUserReviews = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, { walletAddress }) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userWallet", walletAddress))
      .collect();

    // Get project info for each review
    const reviewsWithProjects = await Promise.all(
      reviews.map(async (review) => {
        const project = await ctx.db.get(review.projectId);
        return {
          ...review,
          projectName: project?.name,
          projectLogo: project?.logo,
        };
      })
    );

    return reviewsWithProjects.sort((a, b) => b.createdAt - a.createdAt);
  },
});
