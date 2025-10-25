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
  Zap,
  X,
} from "lucide-react";
import Link from "next/link";

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
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-8 border-[#FFDF00]/20 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-[#FFDF00] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white/60 text-base font-bold uppercase tracking-wider">
            Loading Categories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#151515] via-[#0A0A0A] to-[#0A0A0A]">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#FFDF00]/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFDF00]/10 border border-[#FFDF00]/20 backdrop-blur-sm mb-8">
              <Sparkles className="w-5 h-5 text-[#FFDF00]" />
              <span className="text-xs font-bold text-[#FFDF00] uppercase tracking-wider">
                Browse by Category
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.9] text-white mb-6 tracking-tight">
              Explore
              <br />
              <span className="text-[#FFDF00]">Web3 Categories</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/60 font-medium mb-12 leading-relaxed max-w-2xl mx-auto">
              Discover innovative Web3 projects organized by category. From DeFi
              to NFTs, find what interests you.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-white/40" />
                <Input
                  type="text"
                  placeholder="Search categories..."
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
            <div className="flex flex-wrap justify-center gap-12">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-[#FFDF00] rounded-full animate-pulse"></div>
                  <div className="text-4xl md:text-5xl font-black text-white">
                    {filteredCategories.length}
                  </div>
                </div>
                <div className="text-xs font-bold text-white/60 uppercase tracking-wide">
                  Categories
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                  <div className="text-4xl md:text-5xl font-black text-white">
                    {totalProjects}
                  </div>
                </div>
                <div className="text-xs font-bold text-white/60 uppercase tracking-wide">
                  Projects
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 lg:py-28">
        <div className="container-custom">
          {filteredCategories.length === 0 ? (
            <div className="relative overflow-hidden bg-[#151515] rounded-3xl p-20 text-center border-2 border-dashed border-white/10 max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFDF00]/5 to-transparent"></div>
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#FFDF00]/20 to-transparent rounded-3xl flex items-center justify-center">
                  <Search className="h-12 w-12 text-[#FFDF00]/50" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-4 uppercase">
                  No Categories Found
                </h3>
                <p className="text-white/60 mb-10 max-w-md mx-auto text-lg leading-relaxed">
                  Try adjusting your search terms to find what you're looking
                  for.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center justify-center h-14 px-8 bg-[#FFDF00] hover:bg-[#FFE94D] text-black font-black uppercase text-sm tracking-wider rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Clear Search
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category, index) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden bg-[#151515] rounded-3xl p-8 border border-white/10 hover:border-[#FFDF00]/50 transition-all duration-500 h-full">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFDF00]/0 to-[#FFDF00]/0 group-hover:from-[#FFDF00]/5 group-hover:to-transparent transition-all duration-500"></div>

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="mb-6">
                        <div className="relative inline-block">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#FFDF00] to-amber-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFDF00] to-amber-500 flex items-center justify-center text-3xl">
                            {category.icon}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mb-6">
                        <h3 className="text-2xl font-black text-white mb-3 uppercase group-hover:text-[#FFDF00] transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-white/60 leading-relaxed line-clamp-2">
                          {category.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#FFDF00]/10 text-[#FFDF00] hover:bg-[#FFDF00]/20 border-[#FFDF00]/20 font-bold">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {category.projects_count} projects
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 group-hover:text-[#FFDF00] transition-colors font-bold uppercase text-sm">
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
      <section className="py-20 lg:py-28 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#151515] to-[#0A0A0A]"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#FFDF00]/5 rounded-full blur-[120px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFDF00] to-amber-500 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FFDF00] to-amber-500 flex items-center justify-center">
                <Rocket className="h-10 w-10 text-black" />
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 uppercase leading-[1.1]">
              Can't Find Your Category?
            </h2>
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Submit your project to be featured in our directory and reach
              thousands of Web3 enthusiasts
            </p>

            <Link
              href="/submit"
              className="inline-flex items-center justify-center h-16 px-10 bg-[#FFDF00] hover:bg-[#FFE94D] text-black font-black uppercase text-sm tracking-wider rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_rgba(255,223,0,0.3)]"
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
