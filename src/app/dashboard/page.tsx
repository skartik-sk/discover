"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Star,
  Users,
  Eye,
  Trophy,
  Calendar,
  Settings,
  ExternalLink,
  Heart,
  MessageSquare,
  Zap,
  Shield,
  TrendingUp,
  Award,
  Gift,
  Rocket,
  PlusCircle,
  Edit,
  CheckCircle,
  Clock,
  BarChart3,
  Github,
  Globe,
  Trash2,
  ArrowUpRight,
  Sparkles,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  wallet_address: string | null;
  website: string | null;
  twitter: string | null;
  github: string | null;
  is_active: boolean;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  views: number;
  created_at: string;
  category: {
    name: string;
    slug: string;
    color: string | null;
    icon: string | null;
  } | null;
  tags: string[];
}

interface DashboardStats {
  total_projects: number;
  total_views: number;
  featured_projects: number;
  active_projects: number;
}

export default function DashboardPage() {
  const { user, session, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_projects: 0,
    total_views: 0,
    featured_projects: 0,
    active_projects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: "",
    username: "",
    bio: "",
    website: "",
    twitter: "",
    github: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      window.location.href = "/auth/signin";
      return;
    }

    fetchDashboardData();
  }, [session, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("email", user?.email)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profileData) {
        setError("User profile not found");
        return;
      }

      setProfile(profileData);

      setEditForm({
        display_name: profileData.display_name || "",
        username: profileData.username || "",
        bio: profileData.bio || "",
        website: profileData.website || "",
        twitter: profileData.twitter || "",
        github: profileData.github || "",
      });

      // For now, show empty state since the database schema needs to be set up properly
      // The projects table may not exist or may have different column names
      setProjects([]);
      setStats({
        total_projects: 0,
        total_views: 0,
        featured_projects: 0,
        active_projects: 0,
      });
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from("users")
        .update({
          display_name: editForm.display_name,
          username: editForm.username,
          bio: editForm.bio,
          website: editForm.website,
          twitter: editForm.twitter,
          github: editForm.github,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile({
        ...profile,
        ...editForm,
      });
      setIsEditingProfile(false);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile: " + err.message);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      // Refresh data
      fetchDashboardData();
    } catch (err: any) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project: " + err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-mesh bg-orbs flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-8 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white/60 text-base font-bold uppercase tracking-wider">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return (
      <div className="min-h-screen bg-mesh bg-orbs flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-3xl p-12 text-center border-2 border-border">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4 uppercase">
            Authentication Required
          </h3>
          <p className="text-muted mb-8 text-base md:text-lg leading-relaxed">
            Please sign in to access your dashboard and manage your projects.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center w-full h-14 bg-primary hover:shadow-lg hover:shadow-primary/30 text-dark font-black uppercase text-xs tracking-wider rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <ArrowUpRight className="w-5 h-5 mr-2" />
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-mesh bg-orbs flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-3xl p-12 text-center border-2 border-red-500/20">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center">
            <Shield className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-4 uppercase">
            Error Loading Data
          </h3>
          <p className="text-muted mb-8 text-sm md:text-base">
            {error || "Failed to load dashboard data."}
          </p>
          <div className="flex gap-4">
            <button
              onClick={fetchDashboardData}
              className="flex-1 h-14 bg-primary hover:shadow-lg hover:shadow-primary/30 text-dark font-black uppercase text-xs tracking-wider rounded-full transition-all duration-300"
            >
              Retry
            </button>
            <Link
              href="/projects"
              className="flex-1 h-14 bg-card hover:bg-card/80 text-foreground font-black uppercase text-xs tracking-wider rounded-full transition-all duration-300 flex items-center justify-center border-2 border-border"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh bg-orbs">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#151515]/50 via-transparent to-transparent border-b border-white/5">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

        <div className="container-custom page-header-spaced content-safe relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 md:gap-8 mb-8 md:mb-10 lg:mb-12">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="absolute inset-0 bg-primary rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <Avatar className="relative h-20 w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 ring-4 ring-primary/20">
                <AvatarImage
                  src={profile.avatar_url || undefined}
                  alt={profile.display_name || "User"}
                />
                <AvatarFallback className="bg-primary text-dark text-2xl md:text-3xl lg:text-4xl font-black">
                  {(profile.display_name ||
                    profile.username ||
                    "U")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight">
                  <span className="text-foreground">Welcome,</span>{" "}
                  <span
                    className="bg-gradient-to-r from-[#FFDF00] via-[#FFE94D] to-[#FFDF00] bg-clip-text text-transparent"
                    style={{
                      WebkitTextFillColor: "transparent",
                      WebkitBackgroundClip: "text",
                    }}
                  >
                    {profile.display_name || profile.username || "User"}
                  </span>
                </h1>
                <Badge className="bg-primary text-dark hover:bg-primary/90 px-4 py-2 text-xs font-black uppercase">
                  {profile.role}
                </Badge>
              </div>
              <p className="text-sm md:text-base lg:text-lg text-white/60 mb-3">
                @{profile.username || "no-username"}
              </p>
              {profile.bio && (
                <p className="text-sm md:text-base text-white/80 max-w-2xl leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center justify-center h-12 sm:h-14 px-6 sm:px-8 bg-card hover:bg-card/80 text-foreground font-bold uppercase text-xs tracking-wider rounded-full transition-all duration-300 border border-border hover:border-primary/50"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Settings
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center justify-center h-12 sm:h-14 px-6 sm:px-8 bg-primary hover:shadow-lg hover:shadow-primary/30 text-dark font-black uppercase text-xs tracking-wider rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                New Project
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-transparent rounded-2xl p-6 border border-primary/20 group hover:border-primary/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
              <Rocket className="h-8 w-8 text-primary mb-4" />
              <div className="text-4xl font-black text-foreground mb-1">
                {stats.total_projects}
              </div>
              <div className="text-sm font-bold text-muted uppercase tracking-wide">
                Total Projects
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl p-6 border border-cyan-500/20 group hover:border-cyan-500/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all"></div>
              <Eye className="h-8 w-8 text-cyan-500 mb-4" />
              <div className="text-4xl font-black text-foreground mb-1">
                {stats.total_views.toLocaleString()}
              </div>
              <div className="text-sm font-bold text-muted uppercase tracking-wide">
                Total Views
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl p-6 border border-purple-500/20 group hover:border-purple-500/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all"></div>
              <Trophy className="h-8 w-8 text-purple-500 mb-4" />
              <div className="text-4xl font-black text-foreground mb-1">
                {stats.featured_projects}
              </div>
              <div className="text-sm font-bold text-muted uppercase tracking-wide">
                Featured
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl p-6 border border-green-500/20 group hover:border-green-500/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-all"></div>
              <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
              <div className="text-4xl font-black text-white mb-1">
                {stats.active_projects}
              </div>
              <div className="text-sm font-bold text-white/60 uppercase tracking-wide">
                Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8 md:py-12">
        <Tabs defaultValue="projects" className="space-y-6 md:space-y-8">
          <TabsList className="bg-card border border-border p-1.5 mb-12 inline-flex rounded-2xl">
            <TabsTrigger
              value="projects"
              className="data-[state=active]:bg-primary data-[state=active]:text-dark font-black uppercase px-8 py-3 rounded-xl transition-all duration-300"
            >
              My Projects
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-primary data-[state=active]:text-dark font-black uppercase px-8 py-3 rounded-xl transition-all duration-300"
            >
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-8">
            {projects.length === 0 ? (
              <div className="relative overflow-hidden bg-card rounded-3xl p-8 md:p-12 lg:p-20 text-center border-2 border-dashed border-border">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-6 md:mb-8 bg-primary/10 rounded-2xl md:rounded-3xl flex items-center justify-center">
                    <Rocket className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-primary/50" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-4 uppercase">
                    No Projects Yet
                  </h3>
                  <p className="text-white/60 mb-8 md:mb-10 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                    Start showcasing your Web3 innovations by submitting your
                    first project.
                  </p>
                  <Link
                    href="/submit"
                    className="inline-flex items-center justify-center h-12 sm:h-14 px-6 sm:px-8 bg-primary hover:shadow-lg hover:shadow-primary/30 text-dark font-black uppercase text-xs tracking-wider rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Submit Your First Project
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="relative overflow-hidden bg-card rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 border border-border hover:border-primary/30 transition-all group cursor-default"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFDF00]/0 to-[#FFDF00]/0 group-hover:from-[#FFDF00]/5 group-hover:to-transparent transition-all duration-500"></div>

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-start gap-5 flex-1 min-w-0">
                          {project.logo_url && (
                            <div className="relative">
                              <div className="absolute inset-0 bg-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                              <div className="relative w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                                <img
                                  src={project.logo_url}
                                  alt={project.title}
                                  className="w-12 h-12 object-contain"
                                />
                              </div>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground uppercase mb-2 group-hover:text-primary transition-colors truncate">
                              {project.title}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {project.category && (
                                <Badge className="bg-white/10 text-white hover:bg-white/20 border-white/20">
                                  {project.category.icon}{" "}
                                  {project.category.name}
                                </Badge>
                              )}
                              {project.is_featured && (
                                <Badge className="bg-primary text-dark hover:bg-primary/90">
                                  <Star className="h-3 w-3 mr-1 fill-current" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {project.description && (
                        <p className="text-white/60 mb-6 line-clamp-3 text-base leading-relaxed">
                          {project.description}
                        </p>
                      )}

                      {/* Tags */}
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.slice(0, 4).map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-white/5 text-white/70 text-xs font-bold uppercase tracking-wide rounded-full border border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 4 && (
                            <span className="px-3 py-1 bg-white/5 text-white/50 text-xs font-bold uppercase tracking-wide rounded-full border border-white/10">
                              +{project.tags.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-white/10">
                        <div className="flex items-center gap-2 text-white/60">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm font-bold">
                            {project.views || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm font-bold">
                            {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {!project.is_active && (
                          <Badge
                            variant="outline"
                            className="border-white/20 text-white/60"
                          >
                            Inactive
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 md:gap-3">
                        {project.website_url && (
                          <a
                            href={project.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 h-10 md:h-12 bg-white/5 hover:bg-white/10 text-white font-bold text-xs md:text-sm uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-white/10"
                          >
                            <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                            <Globe className="h-4 w-4" />
                            Visit
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 h-10 md:h-12 bg-white/5 hover:bg-white/10 text-white font-bold text-xs md:text-sm uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-white/10"
                          >
                            <Github className="w-3 h-3 md:w-4 md:h-4" />
                            Code
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="h-12 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-sm uppercase rounded-xl transition-all duration-300 border border-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="relative overflow-hidden bg-card rounded-3xl border border-border">
              {/* Header */}
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase mb-2">
                    Profile Information
                  </h2>
                  <p className="text-white/60">
                    Update your public profile details
                  </p>
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="h-12 px-6 bg-primary hover:shadow-lg hover:shadow-primary/30 text-dark font-black uppercase text-sm tracking-wider rounded-full transition-all duration-300 flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                {isEditingProfile ? (
                  <div className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-black text-white mb-3 uppercase tracking-wide">
                          Display Name
                        </label>
                        <Input
                          value={editForm.display_name}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              display_name: e.target.value,
                            })
                          }
                          className="h-14 bg-card border-border text-foreground rounded-xl focus:border-primary"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-white mb-3 uppercase tracking-wide">
                          Username
                        </label>
                        <Input
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              username: e.target.value,
                            })
                          }
                          className="h-14 bg-card border-border text-foreground rounded-xl focus:border-primary"
                          placeholder="username"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-black text-white mb-3 uppercase tracking-wide">
                        Bio
                      </label>
                      <Textarea
                        value={editForm.bio}
                        onChange={(e) =>
                          setEditForm({ ...editForm, bio: e.target.value })
                        }
                        className="min-h-[120px] bg-white/5 border-white/10 text-white rounded-xl focus:border-[#FFDF00] resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-black text-white mb-3 uppercase tracking-wide">
                        Website
                      </label>
                      <Input
                        value={editForm.website}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            website: e.target.value,
                          })
                        }
                        className="h-14 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#FFDF00]"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-black text-white mb-3 uppercase tracking-wide">
                          Twitter
                        </label>
                        <Input
                          value={editForm.twitter}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              twitter: e.target.value,
                            })
                          }
                          className="h-14 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#FFDF00]"
                          placeholder="@username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black text-white mb-3 uppercase tracking-wide">
                          GitHub
                        </label>
                        <Input
                          value={editForm.github}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              github: e.target.value,
                            })
                          }
                          className="h-14 bg-white/5 border-white/10 text-white rounded-xl focus:border-[#FFDF00]"
                          placeholder="username"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button
                        onClick={handleSaveProfile}
                        className="h-14 px-8 bg-[#FFDF00] hover:bg-[#FFE94D] text-black font-black uppercase text-sm tracking-wider rounded-full transition-all duration-300 flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="h-14 px-8 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-sm tracking-wider rounded-full transition-all duration-300 border border-white/10"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm font-black text-white/60 uppercase tracking-wide mb-2">
                          Display Name
                        </div>
                        <div className="text-lg text-white font-bold">
                          {profile.display_name || "Not set"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-black text-white/60 uppercase tracking-wide mb-2">
                          Username
                        </div>
                        <div className="text-lg text-white font-bold">
                          @{profile.username || "no-username"}
                        </div>
                      </div>
                    </div>

                    {profile.bio && (
                      <div>
                        <div className="text-sm font-black text-white/60 uppercase tracking-wide mb-2">
                          Bio
                        </div>
                        <div className="text-lg text-white/80 leading-relaxed">
                          {profile.bio}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-black text-white/60 uppercase tracking-wide mb-2">
                        Email
                      </div>
                      <div className="text-lg text-white font-bold">
                        {profile.email}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#FFDF00] hover:text-[#FFE94D] font-bold transition-colors"
                        >
                          <Globe className="h-5 w-5" />
                          Website
                        </a>
                      )}
                      {profile.twitter && (
                        <a
                          href={`https://twitter.com/${profile.twitter.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#FFDF00] hover:text-[#FFE94D] font-bold transition-colors"
                        >
                          Twitter
                        </a>
                      )}
                      {profile.github && (
                        <a
                          href={`https://github.com/${profile.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#FFDF00] hover:text-[#FFE94D] font-bold transition-colors"
                        >
                          <Github className="h-5 w-5" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
