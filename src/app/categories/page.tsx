"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ArrowRight,
  Rocket,
  TrendingUp,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import LoadingScreen from "@/components/LoadingScreen";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string | null;
  gradient: string | null;
  projects_count: number;
  is_active: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setFilteredCategories(filtered);
  }, [categories, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalProjects = categories.reduce(
    (acc, cat) => acc + cat.projects_count,
    0,
  );

  if (loading) {
    return <LoadingScreen message="Loading Categories..." />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="relative z-10 container-custom">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-8 animate-pulse-glow">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Browse by Category
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.9] text-foreground mb-6 tracking-tight animate-fade-in-up">
              Explore
              <br />
              <span className="text-primary">Web3 Categories</span>
            </h1>

            {/* Description */}
            <p
              className="text-lg md:text-xl text-muted font-medium mb-12 leading-relaxed max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              Discover innovative Web3 projects organized by category. From DeFi
              to NFTs, find what interests you.
            </p>

            {/* Search Bar */}
            <div
              className="max-w-2xl mx-auto mb-12 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search categories..."
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

            {/* Stats */}
            <div
              className="flex flex-wrap justify-center gap-12 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <div className="text-4xl md:text-5xl font-black text-foreground">
                    {filteredCategories.length}
                  </div>
                </div>
                <div className="text-xs font-bold text-muted uppercase tracking-wide">
                  Categories
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                  <div className="text-4xl md:text-5xl font-black text-foreground">
                    {totalProjects}
                  </div>
                </div>
                <div className="text-xs font-bold text-muted uppercase tracking-wide">
                  Projects
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="relative z-10 py-12 md:py-20">
        <div className="container-custom">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20 max-w-2xl mx-auto animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-white/5 to-transparent mb-6">
                <Search className="h-10 w-10 text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                No Categories Found
              </h3>
              <p className="text-muted mb-8">
                Try adjusting your search terms to find what you&apos;re looking
                for.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center justify-center h-12 px-8 bg-primary hover:bg-primary/90 text-dark font-bold uppercase text-sm tracking-wider rounded-xl transition-all transform hover:scale-105"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative overflow-hidden bg-card rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 h-full group-hover:shadow-lg group-hover:shadow-primary/10 hover:-translate-y-1">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500"></div>

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border-2 border-border group-hover:border-primary/30 transition-all duration-300">
                          <span className="text-3xl">{category.icon}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-black text-foreground mb-3 uppercase group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-muted leading-relaxed line-clamp-2">
                          {category.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-6 border-t border-border">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-bold">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {category.projects_count} projects
                        </Badge>
                        <div className="flex items-center gap-2 text-muted group-hover:text-primary transition-colors font-bold uppercase text-sm">
                          <span>Explore</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 md:py-28">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-8 animate-pulse-glow">
              <Rocket className="h-10 w-10 text-primary" />
            </div>

            <h2 className="text-4xl lg:text-5xl font-black mb-6 uppercase leading-[1.1]">
              <span className="text-foreground">Can&apos;t Find Your</span>{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary bg-clip-text text-transparent">
                Category?
              </span>
            </h2>
            <p className="text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Submit your project to be featured in our directory and reach
              thousands of Web3 enthusiasts
            </p>

            <Link
              href="/submit"
              className="inline-flex items-center justify-center h-16 px-10 bg-primary hover:shadow-lg hover:shadow-primary/50 text-dark font-black uppercase text-sm tracking-wider rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Rocket className="h-5 w-5 mr-3" />
              Submit Your Project
              <ArrowRight className="h-5 w-5 ml-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
