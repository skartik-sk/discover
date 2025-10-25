import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  Star,
  Rocket,
  Shield,
  Zap,
  Globe,
  Github,
  CheckCircle,
  BarChart3,
  Award,
  Target,
  Trophy,
  Search,
  Layers,
  Code,
  Boxes,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const categoryIcons: Record<string, string> = {
  defi: "📊",
  nft: "🎨",
  nfts: "🎨",
  gaming: "🎮",
  dao: "🏛️",
  infrastructure: "⚙️",
  social: "👥",
  education: "📚",
  other: "🚀",
};

async function fetchFeaturedProjects() {
  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) throw error;
    if (!projects || projects.length === 0) return [];

    const userIds = [
      ...new Set(projects.map((p) => p.creator_id).filter(Boolean)),
    ];
    const categoryIds = [
      ...new Set(projects.map((p) => p.category_id).filter(Boolean)),
    ];

    const { data: users } = await supabase
      .from("users")
      .select("id, username, display_name, avatar_url")
      .in("id", userIds);

    const { data: categories } = await supabase
      .from("categories")
      .select("id, name, slug, icon, color")
      .in("id", categoryIds);

    const { data: tagsData } = await supabase
      .from("project_tags")
      .select("project_id, tag_name")
      .in(
        "project_id",
        projects.map((p) => p.id),
      );

    const usersMap = new Map(users?.map((u) => [u.id, u]) || []);
    const categoriesMap = new Map(categories?.map((c) => [c.id, c]) || []);
    const tagsMap = new Map<string, string[]>();

    tagsData?.forEach((tag) => {
      if (!tagsMap.has(tag.project_id)) {
        tagsMap.set(tag.project_id, []);
      }
      tagsMap.get(tag.project_id)?.push(tag.tag_name);
    });

    return projects.map((project) => ({
      ...project,
      owner:
        project.creator_id && usersMap.has(project.creator_id)
          ? {
              ...usersMap.get(project.creator_id),
              displayName:
                usersMap.get(project.creator_id)?.display_name ||
                usersMap.get(project.creator_id)?.username,
            }
          : null,
      categories:
        project.category_id && categoriesMap.has(project.category_id)
          ? categoriesMap.get(project.category_id)
          : null,
      tags: tagsMap.get(project.id) || [],
    }));
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }
}

async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function fetchPlatformStats() {
  try {
    const [projectsResult, usersResult, projectsData] = await Promise.all([
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
      supabase.from("projects").select("views").eq("is_active", true),
    ]);

    const totalViews = projectsData.data?.reduce(
      (sum, project) => sum + (project.views || 0),
      0,
    );

    return {
      projects: projectsResult.count || 0,
      users: usersResult.count || 0,
      views: totalViews || 0,
      categories: 7,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { projects: 0, users: 0, views: 0, categories: 0 };
  }
}

export default async function HomePage() {
  const [featuredProjects, categories, stats] = await Promise.all([
    fetchFeaturedProjects(),
    fetchCategories(),
    fetchPlatformStats(),
  ]);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-[#FFDF00]/10 rounded-full blur-[150px] animate-pulse" />
          <div
            className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[180px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Dot Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgb(255,255,255,0.05)_1px,_transparent_0)] bg-[size:40px_40px] pointer-events-none opacity-30" />

        <div className="container-custom relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FFDF00]/20 to-cyan-500/20 border border-white/10 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-[#FFDF00] animate-pulse" />
                <span className="text-sm font-bold text-white/90 uppercase tracking-wider">
                  The Ultimate Web3 Showcase Platform
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-center text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.95] mb-8 tracking-tight animate-fade-in-up">
              <span className="block text-white">Discover &</span>
              <span className="block bg-gradient-to-r from-[#FFDF00] via-amber-400 to-[#FFDF00] bg-clip-text text-transparent animate-gradient bg-300% mt-2">
                Showcase Web3
              </span>
              <span className="block text-white mt-2">Projects</span>
            </h1>

            {/* Description */}
            <p
              className="text-center text-xl md:text-2xl text-white/70 leading-relaxed mb-10 max-w-4xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              The leading platform for Web3 builders to showcase innovative
              decentralized applications and connect with early adopters,
              investors, and the community.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-wrap gap-6 justify-center mb-12 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <Button
                asChild
                size="lg"
                className="btn-primary group h-16 px-10 text-base shadow-[0_0_30px_rgba(255,223,0,0.3)] hover:shadow-[0_0_50px_rgba(255,223,0,0.5)] transition-all duration-300"
              >
                <Link href="/submit">
                  <Rocket className="h-5 w-5 mr-2 group-hover:translate-y-[-2px] transition-transform" />
                  Submit Your Project
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-16 px-10 text-base bg-white/5 border-2 border-white/20 hover:bg-white/10 hover:border-[#FFDF00]/50 transition-all duration-300 backdrop-blur-sm"
              >
                <Link href="/projects">
                  Explore Projects
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div
              className="max-w-2xl mx-auto mb-16 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <Link href="/projects" className="block">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search Web3 projects, protocols, or categories..."
                    className="w-full h-16 bg-[#151515] border-2 border-white/10 text-white placeholder:text-white/40 pl-16 pr-6 rounded-2xl text-lg font-medium focus:border-[#FFDF00] focus:outline-none transition-all cursor-pointer"
                    readOnly
                  />
                </div>
              </Link>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "400ms" }}
            >
              <div className="text-center group cursor-default bg-[#151515]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#FFDF00]/30 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-[#FFDF00] to-amber-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.projects}+
                </div>
                <div className="text-sm md:text-base text-white/60 uppercase font-bold tracking-wide">
                  Projects
                </div>
              </div>
              <div className="text-center group cursor-default bg-[#151515]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.users}+
                </div>
                <div className="text-sm md:text-base text-white/60 uppercase font-bold tracking-wide">
                  Builders
                </div>
              </div>
              <div className="text-center group cursor-default bg-[#151515]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.views > 1000
                    ? `${Math.floor(stats.views / 1000)}K+`
                    : stats.views}
                </div>
                <div className="text-sm md:text-base text-white/60 uppercase font-bold tracking-wide">
                  Views
                </div>
              </div>
              <div className="text-center group cursor-default bg-[#151515]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stats.categories}+
                </div>
                <div className="text-sm md:text-base text-white/60 uppercase font-bold tracking-wide">
                  Categories
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-16 md:py-24 relative">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFDF00]/10 border border-[#FFDF00]/20 mb-4">
                  <Star className="h-5 w-5 text-[#FFDF00] fill-current" />
                  <span className="text-sm font-bold text-[#FFDF00] uppercase tracking-wider">
                    Featured
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase leading-tight">
                  Trending This Week
                </h2>
                <p className="text-lg text-white/60 mt-3 max-w-2xl">
                  Hand-picked exceptional projects gaining traction in our
                  community
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="btn-outline hidden md:inline-flex"
                size="lg"
              >
                <Link href="/projects">
                  View All
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 3).map((project, index) => {
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
                      <CardContent className="p-0">
                        {/* Project Image */}
                        {project.logo_url && (
                          <div className="relative h-48 bg-gradient-to-br from-[#FFDF00]/10 to-transparent overflow-hidden">
                            <img
                              src={project.logo_url}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {project.is_featured && (
                              <div className="absolute top-4 right-4">
                                <div className="bg-[#FFDF00] text-black px-3 py-1 rounded-full flex items-center gap-1 text-xs font-black uppercase">
                                  <Trophy className="h-3 w-3" />
                                  Featured
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start gap-4 mb-4">
                            {!project.logo_url && (
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFDF00] to-amber-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity" />
                                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFDF00] to-amber-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                  <span className="text-2xl font-black text-black">
                                    {project.title.charAt(0)}
                                  </span>
                                </div>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-black text-white mb-2 uppercase group-hover:text-[#FFDF00] transition-colors">
                                {project.title}
                              </h3>
                              {project.categories && (
                                <Badge className="bg-white/10 text-white hover:bg-white/20 text-xs border-0">
                                  {categoryIcons[project.categories.slug] ||
                                    "🚀"}{" "}
                                  {project.categories.name}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-white/60 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {project.description}
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
                              {project.tags.length > 3 && (
                                <Badge className="bg-white/5 text-white/60 hover:bg-white/10 border-0 text-xs">
                                  +{project.tags.length - 3}
                                </Badge>
                              )}
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
                                  <span className="truncate text-xs max-w-[100px]">
                                    {project.owner.displayName}
                                  </span>
                                </div>
                              )}
                            </div>
                            <ArrowRight className="h-5 w-5 text-white/40 group-hover:text-[#FFDF00] group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            <div className="mt-12 text-center md:hidden">
              <Button
                asChild
                variant="outline"
                className="btn-outline"
                size="lg"
              >
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-bold text-purple-500 uppercase tracking-wider">
                Benefits
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase mb-6 leading-tight">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              The ultimate platform for Web3 creators to showcase their
              innovative projects
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-dark border-white/10 hover:border-[#FFDF00]/50 transition-all duration-300 group">
              <CardContent className="p-10 text-center">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFDF00] to-amber-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FFDF00]/20 to-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-10 w-10 text-[#FFDF00]" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white uppercase mb-4 group-hover:text-[#FFDF00] transition-colors">
                  Get Discovered
                </h3>
                <p className="text-white/60 leading-relaxed text-base">
                  Reach thousands of potential users and collaborators looking
                  for innovative Web3 projects like yours
                </p>
              </CardContent>
            </Card>

            <Card className="card-dark border-white/10 hover:border-cyan-500/50 transition-all duration-300 group">
              <CardContent className="p-10 text-center">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-10 w-10 text-cyan-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white uppercase mb-4 group-hover:text-cyan-500 transition-colors">
                  Quality Projects
                </h3>
                <p className="text-white/60 leading-relaxed text-base">
                  Join a curated community of high-quality Web3 projects and
                  innovative decentralized applications
                </p>
              </CardContent>
            </Card>

            <Card className="card-dark border-white/10 hover:border-purple-500/50 transition-all duration-300 group">
              <CardContent className="p-10 text-center">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-10 w-10 text-purple-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white uppercase mb-4 group-hover:text-purple-500 transition-colors">
                  Build Your Brand
                </h3>
                <p className="text-white/60 leading-relaxed text-base">
                  Create a stunning portfolio that showcases your unique Web3
                  projects and technical expertise
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <Boxes className="h-5 w-5 text-green-500" />
              <span className="text-sm font-bold text-green-500 uppercase tracking-wider">
                Process
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase mb-6 leading-tight">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Get your Web3 project featured in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="relative">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFDF00] to-amber-500 text-black font-black text-2xl mb-4">
                  1
                </div>
              </div>
              <Card className="card-dark border-white/10 hover:border-[#FFDF00]/30 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#FFDF00]/10 flex items-center justify-center mx-auto mb-6">
                    <Rocket className="h-8 w-8 text-[#FFDF00]" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase mb-3">
                    Submit Project
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm">
                    Fill out our simple form with your project details, links,
                    and description
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-black font-black text-2xl mb-4">
                  2
                </div>
              </div>
              <Card className="card-dark border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-cyan-500" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase mb-3">
                    Get Reviewed
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm">
                    Our team reviews your submission to ensure quality and
                    authenticity
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-black text-2xl mb-4">
                  3
                </div>
              </div>
              <Card className="card-dark border-white/10 hover:border-purple-500/30 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase mb-3">
                    Go Live
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm">
                    Your project goes live and starts getting discovered by our
                    community
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#151515] to-[#0A0A0A]"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-[#FFDF00]/5 rounded-full blur-[120px]" />
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="container-custom relative z-10">
          <Card className="card-dark border-[#FFDF00]/20 overflow-hidden max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFDF00]/5 via-transparent to-cyan-500/5" />
            <CardContent className="p-12 md:p-20 text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFDF00]/10 border border-[#FFDF00]/20 mb-8">
                <Rocket className="h-5 w-5 text-[#FFDF00]" />
                <span className="text-sm font-bold text-[#FFDF00] uppercase tracking-wider">
                  Ready to Launch?
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase mb-8 leading-[0.95]">
                Showcase Your
                <br />
                <span className="text-[#FFDF00]">Web3 Project Today</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of Web3 builders and get your project in front of
                the right audience
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary group h-16 px-10 text-base shadow-[0_0_30px_rgba(255,223,0,0.3)] hover:shadow-[0_0_50px_rgba(255,223,0,0.5)]"
                >
                  <Link href="/submit">
                    <Rocket className="h-5 w-5 mr-2 group-hover:translate-y-[-2px] transition-transform" />
                    Submit Your Project
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-16 px-10 text-base bg-white/5 border-2 border-white/20 hover:bg-white/10 hover:border-[#FFDF00]/50"
                >
                  <Link href="/projects">
                    <Globe className="h-5 w-5 mr-2" />
                    Explore Projects
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
