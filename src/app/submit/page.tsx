'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
  Users
} from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  gradient: string
  projects_count: number
}

export default function SubmitProjectPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    website_url: '',
    github_url: '',
    logo_url: '',
    tags: [] as string[],
    tagInput: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError('Failed to load categories')
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required'
    }
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!session) {
      setError('Please sign in to submit a project')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          website_url: formData.website_url,
          github_url: formData.github_url,
          logo_url: formData.logo_url,
          category_slug: formData.category,
          tags: formData.tags,
          is_featured: false
        }),
      })

      if (response.ok) {
        const project = await response.json()
        setIsSubmitted(true)
        // Redirect to the project page after successful submission
        setTimeout(() => {
          router.push(`/projects/${project.owner.username}/${project.slug}`)
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to submit project')
      }
    } catch (error) {
      console.error('Error submitting project:', error)
      setError('An error occurred while submitting your project')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = () => {
    const tag = formData.tagInput.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
        tagInput: ''
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <section className="showcase-hero section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-float inline-flex items-center mb-8">
                <Badge className="showcase-badge">
                  <AlertCircle className="w-3 h-3 mr-2" />
                  Authentication Required
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient-primary mb-6">
                Sign In to Submit
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                You need to sign in to submit your Web3 project to our platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="showcase-btn px-8 py-4" asChild>
                  <Link href="/auth/signin">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="showcase-btn-outline px-8 py-4" asChild>
                  <Link href="/projects">
                    Browse Projects
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <section className="showcase-hero section-padding">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center mb-8">
                <Badge className="showcase-badge bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-2" />
                  Success!
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient-primary mb-6">
                Project Submitted
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                Your project has been successfully submitted and is now under review.
                You will be redirected to your project page shortly.
              </p>

              <div className="flex items-center justify-center space-x-4">
                <Button size="lg" className="showcase-btn px-8 py-4" asChild>
                  <Link href="/projects">
                    View All Projects
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="showcase-btn-outline px-8 py-4" onClick={() => setIsSubmitted(false)}>
                  Submit Another Project
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="showcase-hero section-padding-xs">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            {/* Back Navigation */}
            <Link href="/projects" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>

            {/* Badge */}
            <div className="animate-float inline-flex items-center mb-8">
              <Badge className="showcase-badge animate-pulse-slow">
                <Rocket className="w-3 h-3 mr-2" />
                🚀 Submit Your Project
              </Badge>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient-primary mb-6 animate-fade-in-up">
              Share Your
              <br />
              <span className="text-gradient-accent">Web3 Innovation</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-in-left leading-relaxed">
              Submit your Web3 project to reach thousands of enthusiasts and early adopters.
              <br className="hidden md:block" />
              Get discovered by the community and grow your project.
            </p>

            {/* User Info */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Submitting as: {session.user?.name || session.user?.email}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card className="showcase-card-hover">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Title *
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter your project name"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className={`showcase-input ${errors.title ? 'border-red-500' : ''}`}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="showcase-input">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.slug}>
                              {category.icon} {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <Textarea
                        placeholder="Describe your project in detail..."
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className={`showcase-input ${errors.description ? 'border-red-500' : ''}`}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="showcase-badge flex items-center gap-1"
                          >
                            {tag}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-500"
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                        <div className="flex items-center">
                          <Input
                            type="text"
                            placeholder="Add a tag"
                            value={formData.tagInput}
                            onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                            onKeyPress={handleTagInputKeyPress}
                            className="showcase-input w-32"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addTag}
                            className="showcase-btn-outline ml-2"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Press Enter or click + to add tags
                      </p>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <Input
                        type="url"
                        placeholder="https://yourproject.com"
                        value={formData.website_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                        className="showcase-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub URL
                      </label>
                      <Input
                        type="url"
                        placeholder="https://github.com/username/repo"
                        value={formData.github_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                        className="showcase-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo URL
                      </label>
                      <Input
                        type="url"
                        placeholder="https://example.com/logo.png (optional)"
                        value={formData.logo_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                        className="showcase-input"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Provide a direct URL to your logo image
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-6">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="showcase-btn px-8 py-4 text-base font-semibold shadow-elevation-3 hover:shadow-elevation-4"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Project
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="showcase-card-hover mt-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Be descriptive in your title and description to help others understand your project</li>
                  <li>• Add relevant tags to improve discoverability</li>
                  <li>• Provide a working demo link if possible</li>
                  <li>• Include your GitHub repository for transparency</li>
                  <li>• A good logo helps your project stand out</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}