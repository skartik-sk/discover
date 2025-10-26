"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  ArrowRight,
  Eye,
  Users,
  Sparkles,
  TrendingUp,
  X,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import LoadingScreen from "@/components/LoadingScreen";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  projects_count: number;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  logo_url: string;
  website_url: string;
  github_url: string;
  is_featured: boolean;
  views: number;
  created_at: string;
  user_id: string;
  category_id: string;
}

interface ProjectWithRelations extends Project {
  owner: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
  category: {
    name: string;
    slug: string;
    icon: string;
  } | null;
  tags: string[];
}

const categoryIcons: Record<string, string> = {
  defi: "📊",
  nfts: "🎨",
  gaming: "🎮",
  dao: "🏛️",
  infrastructure: "⚙️",
  social: "👥",
  education: "📚",
  metaverse: "🌐",
  identity: "🆔",
  storage: "💾",
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<
    ProjectWithRelations[]
  >([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [categorySlug]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchQuery, projects]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch category
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", categorySlug)
        .eq("is_active", true)
        .single();

      if (categoryError) throw categoryError;

      if (!categoryData) {
        setError("Category not found");
        setLoading(false);
        return;
      }

      setCategory(categoryData);

      // Fetch projects with relations
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(
          `
          *,
          owner:users!projects_creator_id_fkey(username, display_name, avatar_url),
          category:categories(name, slug, icon)
        `,
        )
        .eq("category_id", categoryData.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      // Fetch tags for each project
      const projectsWithTags = await Promise.all(
        (projectsData || []).map(async (project) => {
          const { data: tagsData } = await supabase
            .from("project_tags")
            .select("tag_name")
            .eq("project_id", project.id);

          return {
            ...project,
            tags: tagsData?.map((t) => t.tag_name) || [],
          };
        }),
      );

      setProjects(projectsWithTags);
      setFilteredProjects(projectsWithTags);
    } catch (err) {
      console.error("Error fetching category data:", err);
      setError("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading Category..." />;
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-lg mx-auto px-6 animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-500/20 to-transparent rounded-3xl flex items-center justify-center">
              <X className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-4xl font-black text-foreground mb-4 uppercase">
              Category Not Found
            </h1>
            <p className="text-muted mb-8 text-lg">
              The category &quot;{categorySlug}&quot; does not exist or is not
              active.
            </p>
            <Button asChild className="btn-primary">
              <Link href="/categories">
                <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                Browse All Categories
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const categoryIcon = categoryIcons[category.slug] || category.icon || "🚀";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />

      {/* Category Header */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-50">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8 animate-fade-in">
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <span>/</span>
              <Link
                href="/categories"
                className="hover:text-foreground transition-colors"
              >
                Categories
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">
                {category.name}
              </span>
            </nav>

            {/* Category Icon */}
            <div
              className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-primary/10 mb-8 animate-fade-in-up"
              style={{ animationDelay: "0ms" }}
            >
              <span className="text-5xl md:text-6xl">{categoryIcon}</span>
            </div>

            {/* Category Title */}
            <h1
              className="text-center text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] mb-6 tracking-tight animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <span
                className="bg-gradient-to-r from-[#FFDF00] via-[#FFE94D] to-[#FFDF00] bg-clip-text text-transparent"
                style={{
                  WebkitTextFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                }}
              >
                {category.name}
              </span>{" "}
              <span className="text-foreground">Projects</span>
            </h1>

            {/* Category Description */}
            <p
              className="text-center text-lg md:text-xl text-muted font-medium mb-12 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              {category.description}
            </p>

            {/* Stats */}
            <div
              className="flex flex-wrap items-center justify-center gap-6 mb-12 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-border">
                <Rocket className="h-5 w-5 text-primary" />
                <span className="text-foreground font-bold">
                  {filteredProjects.length} Projects
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-border">
                <Eye className="h-5 w-5 text-primary" />
                <span className="text-foreground font-bold">
                  {filteredProjects.reduce((acc, p) => acc + (p.views || 0), 0)}{" "}
                  Views
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-border">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-foreground font-bold">
                  {filteredProjects.filter((p) => p.is_featured).length}{" "}
                  Featured
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div
              className="max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={`Search ${category.name.toLowerCase()} projects...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-16 bg-card border-2 border-border text-foreground placeholder:text-muted-foreground pl-16 pr-16 rounded-2xl text-base font-medium focus:border-primary transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-6 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <X className="h-4 w-4 text-foreground" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="relative z-10 py-12 md:py-16">
        <div className="container-custom">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-white/5 to-transparent mb-6">
                <Search className="h-10 w-10 text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                No Projects Found
              </h3>
              <p className="text-muted max-w-md mx-auto">
                {searchQuery
                  ? `No projects match your search "${searchQuery}". Try different keywords.`
                  : `No projects in this category yet. Be the first to submit one!`}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  className="mt-6 btn-secondary"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProjects.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.owner?.username || "demo"}/${project.slug}`}
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Card className="h-full bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                    <CardContent className="p-6">
                      {/* Project Header */}
                      <div className="flex items-start gap-4 mb-4">
                        {/* Logo */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-border">
                          {project.logo_url &&
                          !project.logo_url.includes("placeholder") ? (
                            <img
                              src={project.logo_url}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-black text-primary">
                              {project.title.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Title & Featured Badge */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          {project.is_featured && (
                            <Badge className="badge-primary">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted text-sm line-clamp-3 mb-4">
                        {project.description || "No description available"}
                      </p>

                      {/* Tags */}
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.slice(0, 3).map((tag: string) => (
                            <Badge
                              key={tag}
                              className="bg-white/5 dark:bg-white/10 text-muted-foreground hover:bg-white/10 dark:hover:bg-white/15 border-0 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge className="bg-white/5 dark:bg-white/10 text-muted-foreground border-0 text-xs">
                              +{project.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {project.views || 0}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {filteredProjects.length > 0 && (
        <section className="relative z-10 py-20 md:py-28">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-pulse-glow">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-primary text-xs font-bold uppercase tracking-wider">
                  Join The Community
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight mb-6">
                <span className="text-foreground">Submit Your</span>{" "}
                <span
                  className="bg-gradient-to-r from-[#FFDF00] via-[#FFE94D] to-[#FFDF00] bg-clip-text text-transparent"
                  style={{
                    WebkitTextFillColor: "transparent",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  {category.name}
                </span>{" "}
                <span className="text-foreground">Project</span>
              </h2>
              <p className="text-lg text-muted mb-8">
                Share your innovative {category.name.toLowerCase()} project with
                thousands of enthusiasts and early adopters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/submit">
                  <Button className="btn-primary">
                    <Rocket className="h-5 w-5 mr-2" />
                    Submit Project
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button className="btn-secondary">
                    Browse All Categories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
