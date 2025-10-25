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
  ExternalLink,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

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
    if (tag && !formData.tags.includes(tag)) {
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white/60 text-base">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen">
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center mb-8">
                <div className="badge-secondary">
                  <AlertCircle className="w-4 h-4" />
                  <span>Authentication Required</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] mb-6 animate-fade-in-up text-white">
                Sign In to Submit
              </h1>

              <p className="section-description mb-12">
                You need to sign in to submit your Web3 project to our platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signin">
                  <button className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-dark font-black uppercase text-base tracking-wider rounded-lg hover:bg-primary/90 transition-all hover:scale-105">
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/projects">
                  <button className="inline-flex items-center gap-3 px-8 py-4 bg-dark-lighter border-2 border-white/10 text-white font-black uppercase text-base tracking-wider rounded-lg hover:border-primary/50 transition-all">
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
      <div className="min-h-screen">
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center mb-8">
                <div className="badge-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span>Success!</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] mb-6 animate-fade-in-up text-white">
                Project Submitted
              </h1>

              <p className="section-description mb-12">
                Your project has been successfully submitted and is now under
                review. You will be redirected to your project page shortly.
              </p>

              <div className="flex items-center justify-center space-x-4">
                <Link href="/projects">
                  <button className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-dark font-black uppercase text-base tracking-wider rounded-lg hover:bg-primary/90 transition-all hover:scale-105">
                    View All Projects
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-padding-sm border-b border-white/5">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/projects"
              className="inline-flex items-center text-gray-400 hover:text-primary mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="uppercase text-xs font-bold tracking-wider">
                Back to Projects
              </span>
            </Link>

            <div className="text-center">
              <div className="inline-flex items-center mb-6">
                <div className="badge-primary animate-pulse-glow">
                  <Rocket className="w-4 h-4" />
                  <span>Submit Your Project</span>
                </div>
              </div>

              <h1 className="section-title mb-6 animate-fade-in-up">
                Share Your Web3 Innovation
              </h1>

              <p className="section-description mb-8">
                Submit your Web3 project to reach thousands of enthusiasts and
                early adopters. Get discovered by the community and grow your
                project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            {error && (
              <div className="mb-8 p-6 bg-red-500/10 border-2 border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Card */}
              <div className="card-dark p-8">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase mb-6 text-white">
                  Project Information
                </h2>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-white mb-3">
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
                      className={`input-dark ${errors.title ? "border-red-500" : ""}`}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-white mb-3">
                      Category <span className="text-primary">*</span>
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger
                        className={`input-dark ${errors.category ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-lighter border-2 border-white/10 rounded-lg">
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.slug}
                            className="text-white hover:bg-white/5 cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              <span className="font-medium">
                                {category.name}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-white mb-3">
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
                      className={`input-dark resize-none ${errors.description ? "border-red-500" : ""}`}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-400 mt-2 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Minimum 50 characters recommended
                    </p>
                  </div>
                </div>
              </div>

              {/* Links Card */}
              <div className="card-dark p-8">
                <h2 className="text-2xl font-bold uppercase mb-6 text-white">
                  Project Links
                </h2>

                <div className="space-y-6">
                  {/* Website URL */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
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
                      className="input-dark"
                    />
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                      <Github className="w-4 h-4" />
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
                      className="input-dark"
                    />
                  </div>

                  {/* Logo URL */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4" />
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
                      className="input-dark"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: Square image, min 400x400px
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags Card */}
              <div className="card-dark p-8">
                <h2 className="text-2xl font-bold uppercase mb-6 text-white">
                  Tags
                </h2>

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
                      className="input-dark flex-1"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-6 py-3 bg-primary text-dark font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <div
                          key={index}
                          className="badge-tag flex items-center gap-2"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-primary transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-4">
                <Link href="/projects">
                  <button
                    type="button"
                    className="px-8 py-4 bg-dark-lighter border-2 border-white/10 text-white font-bold uppercase tracking-wider rounded-lg hover:border-primary/50 transition-all"
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-dark font-bold uppercase tracking-wider rounded-lg hover:bg-primary/90 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark"></div>
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
        </div>
      </section>
    </div>
  );
}
