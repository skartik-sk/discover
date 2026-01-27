import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// List all projects with optional filtering
export const list = query({
  args: {
    category: v.optional(v.string()),
    chain: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, { category, chain, featured, search }) => {
    let projects;

    // Use search if provided
    if (search) {
      projects = await ctx.db
        .query("projects")
        .withSearchIndex("search_projects", (q) =>
          q.search("name", search)
            .eq("category", category ?? "")
            .eq("chain", chain ?? "")
        )
        .collect();
    } else {
      // Build query with filters - use separate queries for each index
      if (category) {
        projects = await ctx.db
          .query("projects")
          .withIndex("by_category", (q) => q.eq("category", category))
          .collect();
      } else if (chain) {
        projects = await ctx.db
          .query("projects")
          .withIndex("by_chain", (q) => q.eq("chain", chain))
          .collect();
      } else if (featured !== undefined) {
        projects = await ctx.db
          .query("projects")
          .withIndex("by_featured", (q) => q.eq("featured", featured))
          .collect();
      } else {
        projects = await ctx.db.query("projects").collect();
      }

      // Apply additional filters
      if (category && chain) {
        projects = projects.filter((p) => p.chain === chain);
      }
      if (featured !== undefined && !category && !chain) {
        projects = projects.filter((p) => p.featured === featured);
      }
    }

    // Convert storage IDs to URLs for each project
    const projectsWithUrls = await Promise.all(
      projects.map(async (project) => {
        let logoUrl = project.logo;
        if (project.logoStorageId) {
          const url = await ctx.storage.getUrl(project.logoStorageId);
          if (url) logoUrl = url;
        }

        let coverImageUrl = project.coverImage;
        if (project.coverImageStorageId) {
          const url = await ctx.storage.getUrl(project.coverImageStorageId);
          if (url) coverImageUrl = url;
        }

        return {
          ...project,
          logo: logoUrl,
          coverImage: coverImageUrl,
        };
      })
    );

    // Sort by upvotes (descending) and creation date
    return projectsWithUrls.sort((a, b) => {
      if (b.upvoteCount !== a.upvoteCount) {
        return b.upvoteCount - a.upvoteCount;
      }
      return b.createdAt - a.createdAt;
    });
  },
});

// Get single project by ID with team members and screenshots
export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    const project = await ctx.db.get(id);
    if (!project) return null;

    // Get team members
    const team = await ctx.db
      .query("teamMembers")
      .withIndex("by_project", (q) => q.eq("projectId", id))
      .collect();

    // Get screenshots
    const screenshots = await ctx.db
      .query("screenshots")
      .withIndex("by_project", (q) => q.eq("projectId", id))
      .collect();

    // Sort screenshots by order
    screenshots.sort((a, b) => a.order - b.order);

    // Get reviews
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_project", (q) => q.eq("projectId", id))
      .collect();

    // Convert logo storageId to URL if present
    let logoUrl = project.logo;
    if (project.logoStorageId) {
      const url = await ctx.storage.getUrl(project.logoStorageId);
      if (url) logoUrl = url;
    }

    // Convert cover image storageId to URL if present
    let coverImageUrl = project.coverImage;
    if (project.coverImageStorageId) {
      const url = await ctx.storage.getUrl(project.coverImageStorageId);
      if (url) coverImageUrl = url;
    }

    return {
      ...project,
      logo: logoUrl,
      coverImage: coverImageUrl,
      team,
      screenshots: screenshots.map((s) => s.url),
      screenshotDetails: screenshots.map((s) => ({
        url: s.url,
        storageId: s.storageId,
        order: s.order,
      })),
      reviews: reviews.map((r) => ({
        id: r._id,
        user: r.userName,
        avatar: r.userAvatar,
        rating: r.rating,
        comment: r.comment,
        date: new Date(r.createdAt).toISOString(),
      })),
    };
  },
});

// Create new project
export const create = mutation({
  args: {
    ownerWallet: v.string(),
    name: v.string(),
    tagline: v.string(),
    description: v.string(),
    logo: v.string(),
    logoStorageId: v.optional(v.id("_storage")),
    coverImage: v.string(),
    coverImageStorageId: v.optional(v.id("_storage")),
    category: v.string(),
    tags: v.array(v.string()),
    chain: v.string(),
    launchDate: v.string(),
    verified: v.optional(v.boolean()),
    featured: v.optional(v.boolean()),
    tvl: v.optional(v.string()),
    users: v.string(),
    transactions: v.string(),
    growth: v.number(),
    tokenSymbol: v.optional(v.string()),
    tokenAddress: v.optional(v.string()),
    tokenPrice: v.optional(v.string()),
    tokenMarketCap: v.optional(v.string()),
    tokenChange24h: v.optional(v.number()),
    website: v.optional(v.string()),
    twitter: v.optional(v.string()),
    discord: v.optional(v.string()),
    github: v.optional(v.string()),
    auditUrl: v.optional(v.string()),
    team: v.optional(
      v.array(
        v.object({
          name: v.string(),
          role: v.string(),
          avatar: v.string(),
        })
      )
    ),
    screenshots: v.optional(v.array(v.string())),
    screenshotStorageIds: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const { team, screenshots, screenshotStorageIds, ...projectData } = args;

    // Create project
    const projectId = await ctx.db.insert("projects", {
      ...projectData,
      upvoteCount: 0,
      reviewCount: 0,
      averageRating: 0,
      verified: projectData.verified ?? false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Add team members
    if (team && team.length > 0) {
      for (const member of team) {
        await ctx.db.insert("teamMembers", {
          projectId,
          ...member,
        });
      }
    }

    // Add screenshots with storage IDs
    if (screenshotStorageIds && screenshotStorageIds.length > 0) {
      for (let i = 0; i < screenshotStorageIds.length; i++) {
        const storageId = screenshotStorageIds[i];
        const url = await ctx.storage.getUrl(storageId);
        await ctx.db.insert("screenshots", {
          projectId,
          storageId,
          url: url || '',
          order: i,
        });
      }
    } else if (screenshots && screenshots.length > 0) {
      // Fallback for legacy string URLs
      for (let i = 0; i < screenshots.length; i++) {
        await ctx.db.insert("screenshots", {
          projectId,
          storageId: "" as any,
          url: screenshots[i],
          order: i,
        });
      }
    }

    return projectId;
  },
});

// Update project (owner only)
export const update = mutation({
  args: {
    id: v.id("projects"),
    ownerWallet: v.string(),
    name: v.optional(v.string()),
    tagline: v.optional(v.string()),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    logoStorageId: v.optional(v.id("_storage")),
    coverImage: v.optional(v.string()),
    coverImageStorageId: v.optional(v.id("_storage")),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    chain: v.optional(v.string()),
    launchDate: v.optional(v.string()),
    tvl: v.optional(v.string()),
    users: v.optional(v.string()),
    transactions: v.optional(v.string()),
    growth: v.optional(v.number()),
    tokenSymbol: v.optional(v.string()),
    tokenAddress: v.optional(v.string()),
    tokenPrice: v.optional(v.string()),
    tokenMarketCap: v.optional(v.string()),
    tokenChange24h: v.optional(v.number()),
    website: v.optional(v.string()),
    twitter: v.optional(v.string()),
    discord: v.optional(v.string()),
    github: v.optional(v.string()),
    auditUrl: v.optional(v.string()),
  },
  handler: async (ctx, { id, ownerWallet, ...updates }) => {
    const project = await ctx.db.get(id);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerWallet !== ownerWallet) {
      throw new Error("Only the project owner can update this project");
    }

    // If logoStorageId is being updated, also update the logo URL
    if (updates.logoStorageId) {
      const logoUrl = await ctx.storage.getUrl(updates.logoStorageId);
      if (logoUrl) {
        updates.logo = logoUrl;
      }
    }

    // If coverImageStorageId is being updated, also update the coverImage URL
    if (updates.coverImageStorageId) {
      const coverImageUrl = await ctx.storage.getUrl(updates.coverImageStorageId);
      if (coverImageUrl) {
        updates.coverImage = coverImageUrl;
      }
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Toggle upvote
export const toggleUpvote = mutation({
  args: {
    projectId: v.id("projects"),
    userWallet: v.string(),
  },
  handler: async (ctx, { projectId, userWallet }) => {
    // Check if user already upvoted
    const existing = await ctx.db
      .query("upvotes")
      .withIndex("by_project_user", (q) =>
        q.eq("projectId", projectId).eq("userWallet", userWallet)
      )
      .first();

    const project = await ctx.db.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (existing) {
      // Remove upvote
      await ctx.db.delete(existing._id);
      await ctx.db.patch(projectId, {
        upvoteCount: Math.max(0, project.upvoteCount - 1),
      });
      return { upvoted: false, count: Math.max(0, project.upvoteCount - 1) };
    } else {
      // Add upvote
      await ctx.db.insert("upvotes", {
        projectId,
        userWallet,
        createdAt: Date.now(),
      });
      await ctx.db.patch(projectId, {
        upvoteCount: project.upvoteCount + 1,
      });
      return { upvoted: true, count: project.upvoteCount + 1 };
    }
  },
});

// Check if user has upvoted
export const hasUpvoted = query({
  args: {
    projectId: v.id("projects"),
    userWallet: v.string(),
  },
  handler: async (ctx, { projectId, userWallet }) => {
    const upvote = await ctx.db
      .query("upvotes")
      .withIndex("by_project_user", (q) =>
        q.eq("projectId", projectId).eq("userWallet", userWallet)
      )
      .first();

    return upvote !== null;
  },
});

// Get featured projects
export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();

    // Convert storage IDs to URLs for each project
    const projectsWithUrls = await Promise.all(
      projects.map(async (project) => {
        let logoUrl = project.logo;
        if (project.logoStorageId) {
          const url = await ctx.storage.getUrl(project.logoStorageId);
          if (url) logoUrl = url;
        }

        let coverImageUrl = project.coverImage;
        if (project.coverImageStorageId) {
          const url = await ctx.storage.getUrl(project.coverImageStorageId);
          if (url) coverImageUrl = url;
        }

        return {
          ...project,
          logo: logoUrl,
          coverImage: coverImageUrl,
        };
      })
    );

    // Sort by upvotes
    return projectsWithUrls
      .sort((a, b) => b.upvoteCount - a.upvoteCount)
      .slice(0, 3);
  },
});

// Get projects by owner
export const getUserProjects = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, { walletAddress }) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerWallet", walletAddress))
      .collect();

    // Convert storage IDs to URLs for each project
    const projectsWithUrls = await Promise.all(
      projects.map(async (project) => {
        let logoUrl = project.logo;
        if (project.logoStorageId) {
          const url = await ctx.storage.getUrl(project.logoStorageId);
          if (url) logoUrl = url;
        }

        let coverImageUrl = project.coverImage;
        if (project.coverImageStorageId) {
          const url = await ctx.storage.getUrl(project.coverImageStorageId);
          if (url) coverImageUrl = url;
        }

        return {
          ...project,
          logo: logoUrl,
          coverImage: coverImageUrl,
        };
      })
    );

    return projectsWithUrls.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get projects upvoted by user
export const getUserUpvotedProjects = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, { walletAddress }) => {
    // Get all upvotes by the user
    const upvotes = await ctx.db
      .query("upvotes")
      .withIndex("by_user", (q) => q.eq("userWallet", walletAddress))
      .collect();

    // Get the projects for each upvote
    const projects = await Promise.all(
      upvotes.map(async (upvote) => {
        const project = await ctx.db.get(upvote.projectId);
        return project ? { ...project, upvotedAt: upvote.createdAt } : null;
      })
    );

    // Filter out null values (deleted projects)
    const validProjects = projects.filter((p) => p !== null);

    // Convert storage IDs to URLs for each project
    const projectsWithUrls = await Promise.all(
      validProjects.map(async (project) => {
        let logoUrl = project.logo;
        if (project.logoStorageId) {
          const url = await ctx.storage.getUrl(project.logoStorageId);
          if (url) logoUrl = url;
        }

        let coverImageUrl = project.coverImage;
        if (project.coverImageStorageId) {
          const url = await ctx.storage.getUrl(project.coverImageStorageId);
          if (url) coverImageUrl = url;
        }

        return {
          ...project,
          logo: logoUrl,
          coverImage: coverImageUrl,
        };
      })
    );

    // Sort by upvote date (most recent first)
    return projectsWithUrls.sort((a, b) => b.upvotedAt - a.upvotedAt);
  },
});

// Update team members
export const updateTeam = mutation({
  args: {
    projectId: v.id("projects"),
    ownerWallet: v.string(),
    team: v.array(
      v.object({
        name: v.string(),
        role: v.string(),
        avatarUrl: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { projectId, ownerWallet, team }) => {
    // Verify project exists and user is owner
    const project = await ctx.db.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    if (project.ownerWallet.toLowerCase() !== ownerWallet.toLowerCase()) {
      throw new Error("Unauthorized: You don't own this project");
    }

    // Delete existing team members
    const existingTeam = await ctx.db
      .query("teamMembers")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect();
    
    for (const member of existingTeam) {
      await ctx.db.delete(member._id);
    }

    // Insert new team members
    for (const member of team) {
      await ctx.db.insert("teamMembers", {
        projectId,
        name: member.name,
        role: member.role,
        avatar: member.avatarUrl || '', // Use 'avatar' field as per schema
      });
    }

    return { success: true };
  },
});

// Update screenshots
export const updateScreenshots = mutation({
  args: {
    projectId: v.id("projects"),
    ownerWallet: v.string(),
    screenshotStorageIds: v.array(v.string()),
  },
  handler: async (ctx, { projectId, ownerWallet, screenshotStorageIds }) => {
    // Verify project exists and user is owner
    const project = await ctx.db.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }
    if (project.ownerWallet.toLowerCase() !== ownerWallet.toLowerCase()) {
      throw new Error("Unauthorized: You don't own this project");
    }

    // Delete existing screenshots
    const existingScreenshots = await ctx.db
      .query("screenshots")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect();
    
    for (const screenshot of existingScreenshots) {
      await ctx.db.delete(screenshot._id);
    }

    // Insert new screenshots with order
    for (let i = 0; i < screenshotStorageIds.length; i++) {
      const storageId = screenshotStorageIds[i] as Id<"_storage">;
      const url = await ctx.storage.getUrl(storageId);
      
      if (url) {
        await ctx.db.insert("screenshots", {
          projectId,
          storageId, // Required field
          url,
          order: i,
        });
      }
    }

    return { success: true };
  },
});
