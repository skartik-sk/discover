"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Star,
  Users,
  ArrowRight,
  Trophy,
  ExternalLink,
  Grid,
  List,
  Loader2,
  Eye,
  Github,
  Globe,
  Calendar,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  gradient: string | null;
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
  user: {
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
  category: Category | null;
  tags: string[];
}

const sortOptions = [
  { value: "featured", label: "Featured First" },
  { value: "newest", label: "Newest First" },
  { value: "views", label: "Most Viewed" },
  { value: "oldest", label: "Oldest First" },
];

const PROJECTS_PER_PAGE = 12;

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch categories and projects on mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Fetch all active projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;

      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
        return;
      }

      // Get unique user IDs and category IDs
      const userIds = [
        ...new Set(projectsData.map((p: any) => p.creator_id).filter(Boolean)),
      ];
      const categoryIds = [
        ...new Set(projectsData.map((p: any) => p.category_id).filter(Boolean)),
      ];

      // Fetch users
      const { data: usersData } = await supabase
        .from("users")
        .select("id, username, display_name, avatar_url")
        .in("id", userIds);

      // Fetch project tags
      const projectIds = projectsData.map((p: any) => p.id);
      const { data: tagsData } = await supabase
        .from("project_tags")
        .select("project_id, tag_name")
        .in("project_id", projectIds);

      // Create lookup maps
      const usersMap = new Map(usersData?.map((u) => [u.id, u]) || []);
      const categoriesMap = new Map(
        categoriesData?.map((c) => [c.id, c]) || [],
      );
      const tagsMap = new Map<string, string[]>();

      tagsData?.forEach((tag) => {
        if (!tagsMap.has(tag.project_id)) {
          tagsMap.set(tag.project_id, []);
        }
        tagsMap.get(tag.project_id)?.push(tag.tag_name);
      });

      // Transform projects data
      const transformedProjects = projectsData.map((project: any) => ({
        ...project,
        user: usersMap.get(project.creator_id) || null,
        category: categoriesMap.get(project.category_id) || null,
        tags: tagsMap.get(project.id) || [],
      }));

      setProjects(transformedProjects);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort projects when dependencies change
  useEffect(() => {
    let filtered = [...projects];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category?.slug === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "featured":
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "views":
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
    setPage(1); // Reset to first page when filters change
  }, [projects, selectedCategory, searchQuery, sortBy]);

  // Update displayed projects based on pagination
  useEffect(() => {
    const endIndex = page * PROJECTS_PER_PAGE;
    const newDisplayedProjects = filteredProjects.slice(0, endIndex);
    setDisplayedProjects(newDisplayedProjects);
    setHasMore(endIndex < filteredProjects.length);
  }, [filteredProjects, page]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setPage((prev) => prev + 1);
            setLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("featured");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
          <p className="text-muted text-base font-medium">
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-8 bg-background">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black uppercase leading-[1.1] text-foreground mb-6">
              Explore Web3
              <br />
              <span className="text-primary">Projects</span>
            </h1>
            <p className="text-lg md:text-xl text-muted font-medium">
              Discover innovative blockchain projects, DeFi protocols, NFT
              platforms, and more
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto">
            <Card className="card-dark text-center">
              <CardContent className="p-4 md:p-5">
                <div className="text-3xl md:text-3xl lg:text-4xl font-black text-primary mb-2">
                  {projects.length}
                </div>
                <div className="text-xs font-medium text-muted uppercase">
                  Total Projects
                </div>
              </CardContent>
            </Card>
            <Card className="card-dark text-center">
              <CardContent className="p-4 md:p-5">
                <div className="text-3xl md:text-3xl lg:text-4xl font-black text-cyan-500 mb-2">
                  {categories.length}
                </div>
                <div className="text-xs font-medium text-muted uppercase">
                  Categories
                </div>
              </CardContent>
            </Card>
            <Card className="card-dark text-center">
              <CardContent className="p-4 md:p-5">
                <div className="text-3xl md:text-3xl lg:text-4xl font-black text-purple-500 mb-2">
                  {projects.filter((p) => p.is_featured).length}
                </div>
                <div className="text-xs font-medium text-muted uppercase">
                  Featured
                </div>
              </CardContent>
            </Card>
            <Card className="card-dark text-center">
              <CardContent className="p-4 md:p-5">
                <div className="text-3xl md:text-3xl lg:text-4xl font-black text-green-500 mb-2">
                  {projects
                    .reduce((sum, p) => sum + (p.views || 0), 0)
                    .toLocaleString()}
                </div>
                <div className="text-xs font-medium text-muted uppercase">
                  Total Views
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Filter Bar */}
          <div className="mb-12">
            <Card className="card-dark">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Search */}
                  <div className="lg:col-span-5">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Search projects, tags, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-dark pl-12"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="lg:col-span-3">
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="input-dark">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="all" className="text-foreground">
                          All Categories
                        </SelectItem>
                        {categories.map((cat) => (
                          <SelectItem
                            key={cat.id}
                            value={cat.slug}
                            className="text-foreground"
                          >
                            {cat.icon} {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort */}
                  <div className="lg:col-span-3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="input-dark">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {sortOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-foreground"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* View Mode Toggle */}
                  <div className="lg:col-span-1 flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className={`btn-outline ${
                        viewMode === "grid" ? "bg-primary text-dark" : ""
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className={`btn-outline ${
                        viewMode === "list" ? "bg-primary text-dark" : ""
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Active Filters */}
                {(searchQuery ||
                  selectedCategory !== "all" ||
                  sortBy !== "featured") && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                    <span className="text-sm font-medium text-muted">
                      Active filters:
                    </span>
                    <div className="flex flex-wrap gap-2 flex-1">
                      {searchQuery && (
                        <Badge className="bg-primary text-dark">
                          Search: {searchQuery}
                        </Badge>
                      )}
                      {selectedCategory !== "all" && (
                        <Badge className="bg-cyan-500 text-dark">
                          Category:{" "}
                          {
                            categories.find((c) => c.slug === selectedCategory)
                              ?.name
                          }
                        </Badge>
                      )}
                      {sortBy !== "featured" && (
                        <Badge className="bg-purple-500 text-dark">
                          Sort:{" "}
                          {sortOptions.find((o) => o.value === sortBy)?.label}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="btn-outline"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted text-lg font-medium">
              Showing{" "}
              <span className="text-foreground font-bold">
                {displayedProjects.length}
              </span>{" "}
              of{" "}
              <span className="text-foreground font-bold">
                {filteredProjects.length}
              </span>{" "}
              projects
            </p>
          </div>

          {/* Projects Grid/List */}
          {filteredProjects.length === 0 ? (
            <Card className="card-dark">
              <CardContent className="py-20 text-center">
                <Search className="h-16 w-16 mx-auto mb-6 text-muted" />
                <h3 className="text-2xl font-black text-foreground mb-3 uppercase">
                  No Projects Found
                </h3>
                <p className="text-muted mb-8 max-w-md mx-auto">
                  Try adjusting your filters or search terms to find what you're
                  looking for.
                </p>
                <Button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {displayedProjects.map((project) => {
                  // Generate project URL
                  const projectSlug =
                    project.slug ||
                    project.title
                      .toLowerCase()
                      .trim()
                      .replace(/[^\w\s-]/g, "")
                      .replace(/[\s_-]+/g, "-")
                      .replace(/^-+|-+$/g, "");
                  const username = project.user?.username || "demo";
                  const projectUrl = `/projects/${username}/${projectSlug}`;

                  return (
                    <Card
                      key={project.id}
                      className="card-dark group hover:border-primary/50 transition-all duration-300 overflow-hidden"
                    >
                      <CardContent className="p-6">
                        {/* Project Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 border-2 border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {project.logo_url &&
                              !project.logo_url.includes("placeholder") ? (
                                <img
                                  src={project.logo_url}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xl font-black text-primary">
                                  {project.title.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-black text-foreground mb-2 uppercase truncate group-hover:text-primary transition-colors">
                                {project.title}
                              </h3>
                              {project.category && (
                                <Badge className="bg-white/10 dark:bg-white/10 text-foreground hover:bg-white/20">
                                  {project.category.icon}{" "}
                                  {project.category.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {project.is_featured && (
                            <Badge className="bg-primary text-dark hover:bg-primary/90 ml-2 flex-shrink-0">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>

                        {/* Description */}
                        {project.description && (
                          <p className="text-muted mb-4 line-clamp-3">
                            {project.description}
                          </p>
                        )}

                        {/* Tags */}
                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.slice(0, 4).map((tag, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="border-border text-muted text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {project.tags.length > 4 && (
                              <Badge
                                variant="outline"
                                className="border-border text-muted text-xs"
                              >
                                +{project.tags.length - 4}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-6 mb-4 text-sm text-muted">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>{project.views || 0} views</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(
                                project.created_at,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Author */}
                        {project.user && (
                          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={project.user.avatar_url || undefined}
                                alt={project.user.display_name || "User"}
                              />
                              <AvatarFallback className="bg-primary text-dark text-xs font-black">
                                {(project.user.display_name ||
                                  project.user.username ||
                                  "U")[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {project.user.display_name ||
                                  project.user.username}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                @{project.user.username || "anonymous"}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                          {project.website_url && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="btn-outline flex-1"
                            >
                              <a
                                href={project.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Globe className="h-4 w-4 mr-2" />
                                Visit
                              </a>
                            </Button>
                          )}
                          {project.github_url && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="btn-outline flex-1"
                            >
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github className="h-4 w-4 mr-2" />
                                Code
                              </a>
                            </Button>
                          )}
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="btn-outline"
                          >
                            <Link href={projectUrl}>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Load More Observer */}
              {hasMore && (
                <div ref={observerTarget} className="py-12 text-center">
                  {loadingMore && (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-12 w-12 animate-spin text-[#FFDF00]" />
                      <p className="text-white/60 font-medium">
                        Loading more projects...
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* End of Results */}
              {!hasMore && filteredProjects.length > PROJECTS_PER_PAGE && (
                <div className="py-12 text-center">
                  <p className="text-white/60 font-medium">
                    You've reached the end of the list
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
