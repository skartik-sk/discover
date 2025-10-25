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
  }, [projects, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch category
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", categorySlug)
        .eq("is_active", true)
        .single();

      if (categoryError) throw categoryError;
      if (!categoryData) throw new Error("Category not found");

      setCategory(categoryData);

      // Fetch projects for this category
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("category_id", categoryData.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
        setFilteredProjects([]);
        setLoading(false);
        return;
      }

      // Get unique user IDs
      const userIds = [
        ...new Set(projectsData.map((p) => p.creator_id).filter(Boolean)),
      ];

      // Fetch users
      const { data: usersData } = await supabase
        .from("users")
        .select("id, username, display_name, avatar_url")
        .in("id", userIds);

      // Fetch project tags
      const projectIds = projectsData.map((p) => p.id);
      const { data: tagsData } = await supabase
        .from("project_tags")
        .select("project_id, tag_name")
        .in("project_id", projectIds);

      // Create lookup maps
      const usersMap = new Map(usersData?.map((u) => [u.id, u]) || []);
      const tagsMap = new Map<string, string[]>();

      tagsData?.forEach((tag) => {
        if (!tagsMap.has(tag.project_id)) {
          tagsMap.set(tag.project_id, []);
        }
        tagsMap.get(tag.project_id)?.push(tag.tag_name);
      });

      // Transform projects data
      const transformedProjects = projectsData.map((project) => {
        const user = usersMap.get(project.creator_id);
        return {
          ...project,
          owner: user
            ? {
                username: user.username,
                display_name: user.display_name || user.username,
                avatar_url: user.avatar_url,
              }
            : null,
          category: {
            name: categoryData.name,
            slug: categoryData.slug,
            icon: categoryData.icon,
          },
          tags: tagsMap.get(project.id) || [],
        };
      });

      setProjects(transformedProjects);
      setFilteredProjects(transformedProjects);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-8 border-[#FFDF00]/20 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-[#FFDF00] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white/60 text-xl font-bold uppercase tracking-wider">
            Loading Category...
          </p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-500/20 to-transparent rounded-3xl flex items-center justify-center">
            <X className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 uppercase">
            Category Not Found
          </h1>
          <p className="text-white/60 mb-8 text-lg">
            The category "{categorySlug}" does not exist or is not active.
          </p>
          <Button asChild className="btn-primary">
            <Link href="/categories">
              <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
              Browse All Categories
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const categoryIcon = categoryIcons[category.slug] || category.icon || "🚀";

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Category Header */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#151515] via-[#0A0A0A] to-[#0A0A0A]">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#FFDF00]/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
        </div>

        {/* Dot Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgb(255,255,255,0.05)_1px,_transparent_0)] bg-[size:40px_40px] pointer-events-none opacity-30" />

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-white/40 mb-8 animate-fade-in">
              <Link href="/" className="hover:text-white/80 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/categories"
                className="hover:text-white/80 transition-colors"
              >
                Categories
              </Link>
              <span>/</span>
              <span className="text-white/80 font-medium">{category.name}</span>
            </nav>

            {/* Icon */}
            <div className="flex justify-center mb-8 animate-fade-in-up">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFDF00] to-amber-500 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-[#FFDF00] to-amber-500 flex items-center justify-center text-4xl md:text-5xl">
                  {categoryIcon}
                </div>
              </div>
            </div>

            {/* Category Name */}
            <h1
              className="text-center text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] text-white mb-6 tracking-tight animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              {category.name}
              <br />
              <span className="text-[#FFDF00]">Projects</span>
            </h1>

            {/* Description */}
            <p
              className="text-center text-lg md:text-xl text-white/60 font-medium mb-12 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              {category.description}
            </p>

            {/* Search Bar */}
            <div
              className="max-w-2xl mx-auto mb-12 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-white/40" />
                <Input
                  type="text"
                  placeholder={`Search ${category.name.toLowerCase()} projects...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-16 bg-[#151515] border-2 border-white/10 text-white placeholder:text-white/40 pl-16 pr-16 rounded-2xl text-base font-medium focus:border-[#FFDF00] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div
              className="flex justify-center gap-12 animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-[#FFDF00] rounded-full animate-pulse"></div>
                  <div className="text-4xl md:text-5xl font-black text-white">
                    {filteredProjects.length}
                  </div>
                </div>
                <div className="text-sm font-bold text-white/60 uppercase tracking-wide">
                  {searchQuery ? "Filtered" : "Active"} Projects
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                  <div className="text-4xl md:text-5xl font-black text-cyan-500 mb-2">
                    {category.projects_count}
                  </div>
                </div>
                <div className="text-sm font-bold text-white/60 uppercase tracking-wide">
                  Total Projects
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 lg:py-28">
        <div className="container-custom">
          {filteredProjects.length === 0 ? (
            <div className="relative overflow-hidden bg-[#151515] rounded-3xl p-20 text-center border-2 border-dashed border-white/10 max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFDF00]/5 to-transparent"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#FFDF00]/20 to-transparent rounded-3xl flex items-center justify-center">
                  <Search className="h-12 w-12 text-[#FFDF00]/50" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase">
                  No Projects Found
                </h3>
                <p className="text-white/60 mb-10 max-w-md mx-auto text-lg leading-relaxed">
                  {searchQuery
                    ? "Try adjusting your search terms to find more projects."
                    : `No projects have been submitted to the ${category.name} category yet.`}
                </p>
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center justify-center h-14 px-8 bg-[#FFDF00] hover:bg-[#FFE94D] text-black font-black uppercase text-sm tracking-wider rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    Clear Search
                  </button>
                ) : (
                  <Button asChild className="btn-primary">
                    <Link href="/submit">
                      <Rocket className="h-5 w-5 mr-2" />
                      Submit First Project
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => {
                  const projectSlug =
                    project.slug ||
                    project.title
                      .toLowerCase()
                      .trim()
                      .replace(/[^\w\s-]/g, "")
                      .replace(/[\s_-]+/g, "-")
                      .replace(/^-+|-+$/g, "");
                  const username = project.owner?.username || "demo";
                  const projectUrl = `/projects/${username}/${projectSlug}`;

                  return (
                    <Link
                      key={project.id}
                      href={projectUrl}
                      className="group animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Card className="card-dark hover:border-[#FFDF00]/50 transition-all duration-300 h-full overflow-hidden group-hover:shadow-[0_0_30px_rgba(255,223,0,0.15)]">
                        <CardContent className="p-6">
                          {/* Header */}
                          <div className="flex items-start gap-4 mb-4">
                            {project.logo_url && (
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFDF00] to-amber-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity" />
                                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFDF00] to-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                  <img
                                    src={project.logo_url}
                                    alt={project.title}
                                    className="w-10 h-10 object-contain"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-black text-white mb-2 uppercase truncate group-hover:text-[#FFDF00] transition-colors">
                                {project.title}
                              </h3>
                              {project.category && (
                                <Badge className="bg-white/10 text-white hover:bg-white/20 text-xs border-0">
                                  {categoryIcon} {project.category.name}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-white/60 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {project.description || "No description available."}
                          </p>

                          {/* Tags */}
                          {project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.slice(0, 3).map((tag, idx) => (
                                <Badge
                                  key={idx}
                                  className="bg-white/5 text-white/60 hover:bg-white/10 border-0 text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div className="flex items-center gap-4 text-sm text-white/40">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{project.views || 0}</span>
                              </div>
                              {project.owner && (
                                <div className="flex items-center gap-1 truncate">
                                  <Users className="h-4 w-4" />
                                  <span className="truncate text-xs">
                                    {project.owner.display_name}
                                  </span>
                                </div>
                              )}
                            </div>
                            <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-[#FFDF00] group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {/* CTA Section */}
              <div className="relative overflow-hidden bg-[#151515] rounded-3xl p-12 md:p-16 text-center border border-white/10 max-w-3xl mx-auto mt-20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFDF00]/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFDF00] to-amber-500 rounded-3xl blur-xl opacity-50"></div>
                    <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-[#FFDF00] to-amber-500 flex items-center justify-center">
                      <Rocket className="h-8 w-8 text-black" />
                    </div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase">
                    Got a {category.name} Project?
                  </h3>
                  <p className="text-white/60 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                    Submit your project and get discovered by thousands of Web3
                    enthusiasts
                  </p>
                  <Button asChild className="btn-primary">
                    <Link href="/submit">
                      <Rocket className="h-5 w-5 mr-2" />
                      Submit Your Project
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
