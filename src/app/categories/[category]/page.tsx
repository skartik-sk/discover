'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  Trophy,
  ExternalLink,
  Filter,
  Heart,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ProjectCard } from '@/components/cards/project-card'

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

interface Project {
  id: string
  title: string
  description: string
  logo_url: string
  website_url: string
  github_url: string
  is_featured: boolean
  views: number
  created_at: string
  categories: {
    id: string
    slug: string
    name: string
    icon: string
    color: string
    gradient: string
  }
  tags: string[]
}

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.category as string
  const [searchQuery, setSearchQuery] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategory()
    fetchProjects()
  }, [categorySlug])

  useEffect(() => {
    if (searchQuery) {
      const filtered = projects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredProjects(filtered)
    } else {
      setFilteredProjects(projects)
    }
  }, [projects, searchQuery])

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories?slug=${categorySlug}`)
      if (!response.ok) throw new Error('Category not found')

      const data = await response.json()
      setCategory(data)
    } catch (err) {
      setError('Category not found')
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/projects?category=${categorySlug}`)
      if (!response.ok) throw new Error('Failed to fetch projects')

      const data = await response.json()
      setProjects(data.projects)
      setFilteredProjects(data.projects)
    } catch (err) {
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  if (error && !category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The category "{categorySlug}" does not exist.
          </p>
          <Button asChild>
            <Link href="/categories">Browse All Categories</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="py-8 bg-gray-50 border-b border-gray-200">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <Skeleton className="h-12 w-12 mx-auto mb-4 rounded-lg" />
              <Skeleton className="h-8 w-48 mx-auto mb-3" />
              <Skeleton className="h-4 w-96 mx-auto mb-6" />
              <Skeleton className="h-10 w-full max-w-md mx-auto" />
            </div>
          </div>
        </div>
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border border-gray-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const handleProjectClick = (project: Project) => {
    if (project.website_url) {
      window.open(project.website_url, '_blank')
    }
  }

  const handleTestProject = (project: Project) => {
    console.log('Testing project:', project.id)
    // Here you would implement actual testing logic
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simplified Category Header */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-lg mb-4 mx-auto">
              <span className="text-xl font-semibold text-gray-600">
                {category.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {category.name} Projects
            </h1>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {category.description}
            </p>

            {/* Clean Search Bar */}
            <div className="max-w-xl mx-auto relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={`Search ${category.name} projects...`}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Simple Stats */}
            <div className="flex justify-center gap-6 text-sm text-gray-600">
              <span className="font-medium text-gray-900">{filteredProjects.length} Projects</span>
              <span>•</span>
              <span className="font-medium text-gray-900">{category.projects_count} Total</span>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Breadcrumb */}
      <section className="py-3 bg-white border-b border-gray-200">
        <div className="container-custom">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-gray-900">
              Categories
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-900">{category.name}</span>
          </nav>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No projects found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms to find more {category.name.toLowerCase()} projects.
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                // Get project slug
                let projectSlug = project.slug
                if (!projectSlug) {
                  projectSlug = project.title
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                }

                // Mock owner data since we don't have user info in this context
                const mockOwner = {
                  displayName: 'Demo User',
                  username: 'demo'
                }

                return (
                  <ProjectCard
                    key={project.id}
                    project={{
                      ...project,
                      owner: mockOwner,
                      categories: { name: category.name }
                    }}
                    username={mockOwner.username}
                    slug={projectSlug}
                  />
                )
              })}
            </div>
          )}

          {/* Simple Submit CTA */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              <Link href="/submit">
                Submit Your Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}