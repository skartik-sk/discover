import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user by wallet address
export const getByWallet = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, { walletAddress }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", walletAddress))
      .first();
    return user;
  },
});

// Create or update user on wallet connect
export const createOrUpdate = mutation({
  args: {
    walletAddress: v.string(),
    displayName: v.optional(v.string()),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, { walletAddress, displayName, avatar }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", walletAddress))
      .first();

    if (existing) {
      // Update existing user if display name or avatar changed
      if (displayName || avatar) {
        await ctx.db.patch(existing._id, {
          ...(displayName && { displayName }),
          ...(avatar && { avatar }),
        });
      }
      return existing._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      walletAddress,
      displayName: displayName || `User ${walletAddress.slice(0, 6)}`,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${walletAddress}`,
      createdAt: Date.now(),
    });

    return userId;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    walletAddress: v.string(),
    displayName: v.optional(v.string()),
    avatar: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { walletAddress, displayName, avatar, avatarStorageId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", walletAddress))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      ...(displayName && { displayName }),
      ...(avatar && { avatar }),
      ...(avatarStorageId && { avatarStorageId }),
    });

    return user._id;
  },
});

// Get user stats
export const getStats = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, { walletAddress }) => {
    // Count projects submitted
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerWallet", walletAddress))
      .collect();

    // Count reviews written
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userWallet", walletAddress))
      .collect();

    // Count upvotes given
    const upvotes = await ctx.db
      .query("upvotes")
      .withIndex("by_user", (q) => q.eq("userWallet", walletAddress))
      .collect();

    return {
      projectsSubmitted: projects.length,
      reviewsWritten: reviews.length,
      upvotesGiven: upvotes.length,
    };
  },
});
