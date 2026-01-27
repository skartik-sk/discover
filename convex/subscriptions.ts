import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Subscribe to newsletter
export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      throw new Error("This email is already subscribed");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const subscriptionId = await ctx.db.insert("subscriptions", {
      email,
      createdAt: Date.now(),
    });

    return subscriptionId;
  },
});

// Unsubscribe from newsletter
export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!subscription) {
      throw new Error("Email not found in subscriptions");
    }

    await ctx.db.delete(subscription._id);
    return subscription._id;
  },
});

// Check if email is subscribed
export const checkSubscription = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    return subscription !== null;
  },
});

// Get all subscriptions (admin only - for future use)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const subscriptions = await ctx.db.query("subscriptions").collect();
    return subscriptions.sort((a, b) => b.createdAt - a.createdAt);
  },
});
