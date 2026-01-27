import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate upload URL for file uploads
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Get URL for a stored file
export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

// Save file reference after upload (for screenshots)
export const saveScreenshot = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
    url: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("screenshots", args);
  },
});

// Update project logo storage ID
export const updateProjectLogo = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
    url: v.string(),
  },
  handler: async (ctx, { projectId, storageId, url }) => {
    await ctx.db.patch(projectId, {
      logoStorageId: storageId,
      logo: url,
    });
    return projectId;
  },
});

// Update project cover image storage ID
export const updateProjectCoverImage = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
    url: v.string(),
  },
  handler: async (ctx, { projectId, storageId, url }) => {
    await ctx.db.patch(projectId, {
      coverImageStorageId: storageId,
      coverImage: url,
    });
    return projectId;
  },
});
