"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Star,
  Eye,
  Calendar,
  Heart,
  Share2,
  Copy,
  Check,
  MessageSquare,
  TrendingUp,
  Users,
  Sparkles,
  Award,
  ChevronRight,
} from "lucide-react";
import { ViewTracker, useViewTracking } from "@/components/ViewTracker";

interface ProjectDetailProps {
  project: {
    id: string;
    title: string;
    description: string;
    logo_url: string;
    website_url: string;
    github_url: string;
    views: number;
    created_at: string;
    updated_at?: string;
    is_featured?: boolean;
    tags: string[];
    owner: {
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string;
      bio: string;
    };
    categories: {
      id: string;
      name: string;
      slug: string;
      color: string;
      gradient: string;
    };
    reviews: Array<{
      id: string;
      rating: number;
      review_text: string;
      created_at: string;
      users: {
        username: string;
        display_name: string;
        avatar_url: string;
      };
    }>;
  };
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const { views, handleViewIncremented } = useViewTracking(
    project.id,
    project.views || 0,
  );

  const averageRating =
    project.reviews && project.reviews.length > 0
      ? (
          project.reviews.reduce((sum, r) => sum + r.rating, 0) /
          project.reviews.length
        ).toFixed(1)
      : "0.0";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <ViewTracker
        projectId={project.id}
        onViewIncremented={handleViewIncremented}
      />

      {/* Navigation */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                {copiedToClipboard ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Share
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-primary/5 via-card to-card">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 flex items-center justify-center overflow-hidden shadow-lg shadow-primary/10">
                <div className="absolute inset-0 bg-primary/5 blur-xl"></div>
                {project.logo_url &&
                !project.logo_url.includes("placeholder") ? (
                  <img
                    src={project.logo_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="relative text-3xl md:text-4xl font-black text-primary">
                    {project.title.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Title & Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight hover:text-primary transition-colors">
                  {project.title}
                </h1>
                {project.is_featured && (
                  <div className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-primary text-dark text-xs font-bold rounded-md shadow-lg shadow-primary/30">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </div>
                )}
              </div>

              <p className="text-base md:text-lg text-muted leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1 text-xs font-semibold text-muted bg-background border border-border rounded-full hover:border-primary/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {project.website_url && (
                  <a
                    href={project.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-dark text-sm font-bold rounded-lg hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-foreground text-sm font-bold rounded-lg hover:border-primary/30 transition-all"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}
                <button
                  onClick={handleLike}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 bg-card border text-sm font-bold rounded-lg transition-all ${
                    isLiked
                      ? "border-red-500 text-red-500"
                      : "border-border text-muted hover:border-primary/30"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  {likeCount > 0 ? likeCount : "Like"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-border bg-gradient-to-r from-primary/5 via-card/50 to-primary/5">
        <div className="container-custom">
          <div className="grid grid-cols-3 divide-x divide-border">
            <div className="px-4 py-4 text-center hover:bg-primary/5 transition-colors cursor-default">
              <div className="text-2xl md:text-3xl font-black text-foreground mb-1 hover:text-primary transition-colors">
                {views?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-muted uppercase font-semibold tracking-wide">
                Views
              </div>
            </div>
            <div className="px-4 py-4 text-center hover:bg-primary/5 transition-colors cursor-default">
              <div className="text-2xl md:text-3xl font-black text-primary mb-1">
                {averageRating}
              </div>
              <div className="text-xs text-muted uppercase font-semibold tracking-wide">
                Rating
              </div>
            </div>
            <div className="px-4 py-4 text-center hover:bg-primary/5 transition-colors cursor-default">
              <div className="text-2xl md:text-3xl font-black text-foreground mb-1 hover:text-primary transition-colors">
                {project.reviews?.length || 0}
              </div>
              <div className="text-xs text-muted uppercase font-semibold tracking-wide">
                Reviews
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
              <h2 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                About
              </h2>
              <p className="text-base text-muted leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full"></div>
                  Reviews ({project.reviews?.length || 0})
                </h2>
                {project.reviews && project.reviews.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-primary fill-current" />
                    <span className="text-lg font-bold text-foreground">
                      {averageRating}
                    </span>
                  </div>
                )}
              </div>

              {project.reviews && project.reviews.length > 0 ? (
                <div className="space-y-4">
                  {project.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-border last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-border flex items-center justify-center">
                          {review.users?.avatar_url ? (
                            <img
                              src={review.users.avatar_url}
                              alt={review.users.display_name || "User"}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold text-primary">
                              {getInitials(
                                review.users?.display_name ||
                                  review.users?.username ||
                                  "U",
                              )}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div>
                              <div className="text-sm font-bold text-foreground">
                                {review.users?.display_name ||
                                  review.users?.username}
                              </div>
                              <div className="text-xs text-muted">
                                {new Date(review.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${
                                    i < review.rating
                                      ? "text-primary fill-current"
                                      : "text-border"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted leading-relaxed">
                            {review.review_text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-border" />
                  <p className="text-sm text-muted">
                    No reviews yet. Be the first to review this project!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Owner Card */}
            <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-primary animate-pulse" />
                <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                  Created By
                </h3>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary flex items-center justify-center overflow-hidden">
                  {project.owner?.avatarUrl ? (
                    <img
                      src={project.owner.avatarUrl}
                      alt={project.owner.displayName || "Owner"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-base font-black text-primary">
                      {getInitials(
                        project.owner?.displayName ||
                          project.owner?.username ||
                          "U",
                      )}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground truncate">
                    {project.owner?.displayName || project.owner?.username}
                  </div>
                  <div className="text-xs text-muted truncate">
                    @{project.owner?.username}
                  </div>
                </div>
              </div>
              {project.owner?.bio && (
                <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-3">
                  {project.owner.bio}
                </p>
              )}
              <Link
                href={`/u/${project.owner?.username}`}
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-background border border-border text-sm font-bold text-foreground rounded-lg hover:border-primary/30 transition-all"
              >
                View Profile
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {/* Category Card */}
            {project.categories && (
              <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                    Category
                  </h3>
                </div>
                <Link
                  href={`/categories/${project.categories.slug}`}
                  className="block group"
                >
                  <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-border hover:border-primary/50 hover:shadow-md hover:shadow-primary/20 transition-all">
                    <div className="text-2xl mb-2">
                      {project.categories.name === "DeFi" && "📊"}
                      {project.categories.name === "NFTs" && "🎨"}
                      {project.categories.name === "Gaming" && "🎮"}
                      {project.categories.name === "DAO" && "🏛️"}
                      {project.categories.name === "Infrastructure" && "⚙️"}
                      {project.categories.name === "Social" && "👥"}
                      {project.categories.name === "Education" && "📚"}
                    </div>
                    <div className="text-base font-bold text-foreground mb-1">
                      {project.categories.name}
                    </div>
                    <div className="text-xs text-muted group-hover:text-primary transition-colors inline-flex items-center gap-1">
                      Explore more
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-4 w-4 text-primary animate-pulse" />
                <h3 className="text-sm font-black text-foreground uppercase tracking-tight">
                  Information
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2 text-muted">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Created</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2 text-muted">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Status</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-bold rounded">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-muted">
                    <Eye className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Total Views</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {views?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
