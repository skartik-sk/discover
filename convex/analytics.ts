import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getProjectAnalytics = query({
  args: {
    projectId: v.id("projects"),
    timeRange: v.optional(v.union(v.literal("7d"), v.literal("30d"), v.literal("90d"), v.literal("all"))),
  },
  handler: async (ctx, { projectId, timeRange = "all" }) => {
    const project = await ctx.db.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Calculate time filter
    const now = Date.now();
    let startTime = 0;
    switch (timeRange) {
      case "7d":
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case "30d":
        startTime = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case "90d":
        startTime = now - 90 * 24 * 60 * 60 * 1000;
        break;
      case "all":
      default:
        startTime = 0;
    }

    // Get upvotes
    const upvotes = await ctx.db
      .query("upvotes")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect();
    
    const filteredUpvotes = upvotes.filter((u) => u.createdAt >= startTime);

    // Get reviews
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect();
    
    const filteredReviews = reviews.filter((r) => r.createdAt >= startTime);

    // Calculate average rating
    const averageRating =
      filteredReviews.length > 0
        ? filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length
        : 0;

    // Get category rank
    const categoryProjects = await ctx.db
      .query("projects")
      .withIndex("by_category", (q) => q.eq("category", project.category))
      .collect();
    
    const sortedByUpvotes = categoryProjects
      .sort((a, b) => b.upvoteCount - a.upvoteCount);
    
    const categoryRank = sortedByUpvotes.findIndex((p) => p._id === projectId) + 1;

    // Group upvotes by date
    const upvotesByDate: { [date: string]: number } = {};
    filteredUpvotes.forEach((upvote) => {
      const date = new Date(upvote.createdAt).toISOString().split("T")[0];
      upvotesByDate[date] = (upvotesByDate[date] || 0) + 1;
    });

    // Group reviews by date
    const reviewsByDate: { [date: string]: number } = {};
    filteredReviews.forEach((review) => {
      const date = new Date(review.createdAt).toISOString().split("T")[0];
      reviewsByDate[date] = (reviewsByDate[date] || 0) + 1;
    });

    // Calculate rating distribution
    const ratingDistribution: { [rating: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredReviews.forEach((review) => {
      ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
    });

    // Get recent reviews (last 10)
    const recentReviews = filteredReviews
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map((r) => ({
        id: r._id,
        user: r.userName,
        userAvatar: r.userAvatar,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      }));

    // Convert grouped data to array format
    const upvotesTimeSeries = Object.entries(upvotesByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const reviewsTimeSeries = Object.entries(reviewsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalUpvotes: filteredUpvotes.length,
      totalReviews: filteredReviews.length,
      averageRating: parseFloat(averageRating.toFixed(2)),
      categoryRank,
      categoryTotal: categoryProjects.length,
      upvotesByDate: upvotesTimeSeries,
      reviewsByDate: reviewsTimeSeries,
      ratingDistribution: Object.entries(ratingDistribution).map(([rating, count]) => ({
        rating: parseInt(rating),
        count,
      })),
      recentReviews,
      projectName: project.name,
      projectCategory: project.category,
    };
  },
});
