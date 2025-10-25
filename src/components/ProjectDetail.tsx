"use client";

import { useState, useEffect } from "react";
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
  Award,
  Users,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Back Button */}
      <div className="container-custom py-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-white/60 hover:text-[#FFDF00] transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Projects</span>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFDF00]/5 via-transparent to-transparent" />

        <div className="container-custom py-12 relative z-10">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Header */}
              <div className="space-y-6">
                {/* Logo & Meta */}
                <div className="flex items-start gap-6">
                  {project.logo_url && (
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-br from-[#FFDF00] to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity" />
                      <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FFDF00] to-amber-500 p-0.5">
                        <div className="w-full h-full rounded-2xl bg-[#0A0A0A] flex items-center justify-center p-3">
                          <img
                            src={project.logo_url}
                            alt={project.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      {project.categories && (
                        <Badge className="bg-white/10 hover:bg-white/20 text-white border-0 text-sm">
                          {project.categories.name}
                        </Badge>
                      )}
                      {project.is_featured && (
                        <Badge className="bg-[#FFDF00] hover:bg-[#FFDF00]/90 text-black border-0">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white uppercase leading-tight">
                      {project.title}
                    </h1>
                  </div>
                </div>

                {/* Description */}
                <p className="text-lg text-white/80 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="border-white/20 text-white/80 hover:bg-white/5"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {project.website_url && (
                    <Button asChild size="lg" className="btn-primary group">
                      <a
                        href={project.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="btn-outline"
                    >
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-5 w-5 mr-2" />
                        View Code
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCopyLink}
                    className="btn-outline"
                  >
                    {copiedToClipboard ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="h-5 w-5 mr-2" />
                        Share
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleLike}
                    className={`btn-outline ${isLiked ? "border-red-500 text-red-500" : ""}`}
                  >
                    <Heart
                      className={`h-5 w-5 mr-2 ${isLiked ? "fill-current" : ""}`}
                    />
                    {likeCount}
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="card-dark">
                  <CardContent className="p-6 text-center">
                    <Eye className="h-8 w-8 mx-auto mb-3 text-cyan-500" />
                    <div className="text-3xl font-black text-white mb-1">
                      {project.views?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-white/60 uppercase font-medium">
                      Views
                    </div>
                  </CardContent>
                </Card>
                <Card className="card-dark">
                  <CardContent className="p-6 text-center">
                    <Star className="h-8 w-8 mx-auto mb-3 text-[#FFDF00]" />
                    <div className="text-3xl font-black text-white mb-1">
                      {averageRating}
                    </div>
                    <div className="text-sm text-white/60 uppercase font-medium">
                      Rating
                    </div>
                  </CardContent>
                </Card>
                <Card className="card-dark">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-3 text-purple-500" />
                    <div className="text-3xl font-black text-white mb-1">
                      {project.reviews?.length || 0}
                    </div>
                    <div className="text-sm text-white/60 uppercase font-medium">
                      Reviews
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Reviews Section */}
              <Card className="card-dark">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="h-6 w-6 text-[#FFDF00]" />
                    <h2 className="text-2xl font-black text-white uppercase">
                      Community Reviews
                    </h2>
                  </div>

                  {project.reviews && project.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {project.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-white/10 last:border-0 pb-6 last:pb-0"
                        >
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={review.users?.avatar_url || undefined}
                                alt={review.users?.display_name || "User"}
                              />
                              <AvatarFallback className="bg-[#FFDF00] text-black font-black">
                                {(review.users?.display_name ||
                                  review.users?.username ||
                                  "U")[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="font-bold text-white">
                                    {review.users?.display_name ||
                                      review.users?.username}
                                  </div>
                                  <div className="text-sm text-white/40">
                                    {new Date(
                                      review.created_at,
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-[#FFDF00] fill-current"
                                          : "text-white/20"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-white/80">
                                {review.review_text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 mx-auto mb-4 text-white/20" />
                      <p className="text-white/60">
                        No reviews yet. Be the first to review this project!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Right Side */}
            <div className="space-y-6">
              {/* Owner Card */}
              <Card className="card-dark">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-5 w-5 text-[#FFDF00]" />
                    <h3 className="text-lg font-black text-white uppercase">
                      Project Owner
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-[#FFDF00]">
                        <AvatarImage
                          src={project.owner?.avatarUrl || undefined}
                          alt={project.owner?.displayName || "Owner"}
                        />
                        <AvatarFallback className="bg-[#FFDF00] text-black text-xl font-black">
                          {(project.owner?.displayName ||
                            project.owner?.username ||
                            "U")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-bold text-white text-lg">
                          {project.owner?.displayName ||
                            project.owner?.username}
                        </div>
                        <div className="text-sm text-white/60">
                          @{project.owner?.username}
                        </div>
                      </div>
                    </div>
                    {project.owner?.bio && (
                      <p className="text-sm text-white/80 leading-relaxed">
                        {project.owner.bio}
                      </p>
                    )}
                    <Button
                      asChild
                      variant="outline"
                      className="w-full btn-outline"
                    >
                      <Link href={`/u/${project.owner?.username}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Category Card */}
              {project.categories && (
                <Card className="card-dark">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="h-5 w-5 text-[#FFDF00]" />
                      <h3 className="text-lg font-black text-white uppercase">
                        Category
                      </h3>
                    </div>
                    <Link
                      href={`/categories/${project.categories.slug}`}
                      className="block group"
                    >
                      <div className="relative p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-[#FFDF00]/50 transition-all">
                        <div className="text-4xl mb-3">
                          {project.categories.name === "DeFi" && "📊"}
                          {project.categories.name === "NFTs" && "🎨"}
                          {project.categories.name === "Gaming" && "🎮"}
                          {project.categories.name === "DAO" && "🏛️"}
                          {project.categories.name === "Infrastructure" && "⚙️"}
                          {project.categories.name === "Social" && "👥"}
                          {project.categories.name === "Education" && "📚"}
                        </div>
                        <div className="font-black text-xl text-white mb-2">
                          {project.categories.name}
                        </div>
                        <div className="text-sm text-white/60 group-hover:text-[#FFDF00] transition-colors">
                          Explore more projects →
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Project Info */}
              <Card className="card-dark">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="h-5 w-5 text-[#FFDF00]" />
                    <h3 className="text-lg font-black text-white uppercase">
                      Project Info
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <div className="flex items-center gap-2 text-white/60">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Created</span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {new Date(project.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <div className="flex items-center gap-2 text-white/60">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">Status</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-500 border-0">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2 text-white/60">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">Total Views</span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {project.views?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
