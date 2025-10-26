"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Rocket,
  Star,
  Globe,
  Github,
  Sparkles,
  Zap,
  Layers,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import Link from "next/link";
import LoadingScreen from "@/components/LoadingScreen";
import { AnimatedBackground } from "@/components/AnimatedBackground";

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

export default function SubmitProjectPage() {
  const router = useRouter();
  const { user, session, loading: authLoading, getAuthHeaders } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    website_url: "",
    github_url: "",
    logo_url: "",
    tags: [] as string[],
    tagInput: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories");
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!session) {
      setError("Please sign in to submit a project");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const authHeaders = {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    };

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          website_url: formData.website_url,
          github_url: formData.github_url,
          logo_url: formData.logo_url,
          category_slug: formData.category,
          tags: formData.tags,
          is_featured: false,
        }),
      });

      if (response.ok) {
        const project = await response.json();
        setIsSubmitted(true);
        setTimeout(() => {
          router.push(`/projects/${project.owner.username}/${project.slug}`);
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit project");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      setError("An error occurred while submitting your project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    const tag = formData.tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        tagInput: "",
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  if (authLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedBackground />
        <section className="relative z-10 py-20 px-4">
          <div className="container-custom max-w-2xl mx-auto">
            <div className="text-center space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
                <AlertCircle className="w-10 h-10 text-primary" />
              </div>

              <h1 className="text-4xl md:text-5xl font-black uppercase leading-tight text-foreground">
                Authentication Required
              </h1>

              <p className="text-lg text-muted max-w-md mx-auto">
                Sign in to submit your Web3 project and join our growing
                community of builders.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/auth/signin">
                  <button className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-dark font-black uppercase text-sm tracking-wider rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all hover:scale-105">
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/projects">
                  <button className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm border-2 border-border text-foreground font-black uppercase text-sm tracking-wider rounded-xl hover:border-primary/50 transition-all">
                    Browse Projects
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <AnimatedBackground />
        <section className="relative z-10 py-20 px-4">
          <div className="container-custom max-w-2xl mx-auto">
            <div className="text-center space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-4 animate-pulse-glow">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>

              <h1 className="text-4xl md:text-5xl font-black uppercase leading-tight text-foreground">
                Project Submitted!
              </h1>

              <p className="text-lg text-muted max-w-md mx-auto">
                Your project has been successfully submitted and is now under
                review. Redirecting you to your project page...
              </p>

              <div className="pt-4">
                <div className="inline-flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                  Redirecting...
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />

      {/* Header */}
      <section className="relative z-10 py-12 px-4 border-b border-white/5">
        <div className="container-custom max-w-4xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center text-muted hover:text-primary mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase text-xs font-bold tracking-wider">
              Back to Projects
            </span>
          </Link>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-pulse-glow">
              <Rocket className="w-4 h-4 text-primary" />
              <span className="text-primary text-xs font-bold uppercase tracking-wider">
                Submit Your Project
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight text-foreground animate-fade-in-up">
              Share Your Web3 Innovation
            </h1>

            <p className="text-lg text-muted max-w-2xl mx-auto">
              Submit your Web3 project to reach thousands of enthusiasts and
              early adopters. Get discovered by the community and grow your
              project.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative z-10 py-12 px-4">
        <div className="container-custom max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-5 bg-red-500/10 backdrop-blur-sm border-2 border-red-500/50 rounded-xl flex items-start gap-3 animate-fade-in">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 font-medium text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:border-primary/20 transition-all group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-foreground">
                  Project Information
                </h2>
              </div>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                    Project Title <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., DeFi Trading Platform"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className={`w-full px-4 py-3 bg-card/50 border-2 ${
                      errors.title ? "border-red-500" : "border-border"
                    } rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                    Category <span className="text-primary">*</span>
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger
                      className={`w-full px-4 py-3 bg-card/50 border-2 ${
                        errors.category ? "border-red-500" : "border-border"
                      } rounded-xl text-foreground focus:border-primary transition-all`}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-2 border-border rounded-xl">
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.slug}
                          className="text-foreground hover:bg-white/5 dark:hover:bg-white/5 cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span className="font-medium">{category.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                    Description <span className="text-primary">*</span>
                  </label>
                  <textarea
                    placeholder="Tell us about your project, its features, and what makes it unique..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={6}
                    className={`w-full px-4 py-3 bg-card/50 border-2 ${
                      errors.description ? "border-red-500" : "border-border"
                    } rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all resize-none`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {formData.description.length} / 50 characters minimum
                  </p>
                </div>
              </div>
            </div>

            {/* Links Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:border-primary/20 transition-all group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-foreground">
                  Project Links
                </h2>
              </div>

              <div className="space-y-5">
                {/* Website URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" />
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourproject.com"
                    value={formData.website_url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        website_url: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-card/50 border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                {/* GitHub URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-2">
                    <Github className="w-3.5 h-3.5" />
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={formData.github_url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        github_url: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-card/50 border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all"
                  />
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Logo URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourproject.com/logo.png"
                    value={formData.logo_url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        logo_url: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-card/50 border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended: Square image, minimum 400x400px
                  </p>
                </div>
              </div>
            </div>

            {/* Tags Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:border-primary/20 transition-all group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Tag className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-foreground">
                  Tags
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a tag (e.g., DeFi, NFT, DAO)"
                    value={formData.tagInput}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tagInput: e.target.value,
                      }))
                    }
                    onKeyPress={handleTagInputKeyPress}
                    className="flex-1 px-4 py-3 bg-card/50 border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={formData.tags.length >= 10}
                    className="px-5 py-3 bg-primary text-dark font-bold rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-primary/20 transition-all group/tag"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {formData.tags.length} / 10 tags added
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <Link href="/projects" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-sm border-2 border-border text-foreground font-bold uppercase text-sm tracking-wider rounded-xl hover:border-border/50 transition-all"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-primary text-dark font-black uppercase text-sm tracking-wider rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-dark border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Submit Project
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
