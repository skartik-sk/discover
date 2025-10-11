'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Filter,
  Star,
  Users,
  ArrowRight,
  Trophy,
  ExternalLink,
  Grid,
  List
} from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  logo_url: string
  website_url: string
  github_url: string
  is_featured: boolean
  views: number
  created_at: string
  tags: string[]
  owner: {
    username: string
    displayName: string
  }
  categories: {
    id: string
    name: string
    slug: string
    color: string
    gradient: string
  }
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "views", label: "Most Viewed" }
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Fetch categories and projects on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories([
            { value: "all", label: "All Categories" },
            ...categoriesData.map((cat: any) => ({
              value: cat.slug,
              label: cat.name
            }))
          ])
        }

        // Fetch projects
        await fetchProjects()
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const fetchProjects = async (category?: string, search?: string, sort?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category && category !== 'all') params.append('category', category)
      if (search) params.append('search', search)
      if (sort === 'featured') params.append('featured', 'true')

      const response = await fetch(`/api/projects?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        let fetchedProjects = data.projects || []

        // Sort projects client-side if needed
        if (sort === 'views') {
          fetchedProjects.sort((a: Project, b: Project) => b.views - a.views)
        } else if (sort === 'newest') {
          fetchedProjects.sort((a: Project, b: Project) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        }

        setProjects(fetchedProjects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update projects when filters change
  useEffect(() => {
    fetchProjects(selectedCategory, searchQuery, sortBy)
  }, [selectedCategory, searchQuery, sortBy])

  const handleProjectClick = (projectSlug: string, username: string) => {
    window.open(`/projects/${username}/${projectSlug}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header Section */}
      <section className="showcase-hero section-padding-xs">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto text-center">
            {/* Floating badge */}
            <div className="animate-float inline-flex items-center mb-8">
              <div className="showcase-badge">
                <Search className="w-3 h-3 mr-2" />
                🔍 Explore Web3 Projects
              </div>
            </div>

            {/* Enhanced heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gradient-primary mb-6 animate-fade-in-up">
              Explore
              <br />
              <span className="text-gradient-accent">Innovative Projects</span>
            </h1>

            {/* Enhanced description */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-in-left leading-relaxed">
              Discover cutting-edge Web3 projects and be among the first to test
              <br className="hidden md:block" />
              revolutionary blockchain technology.
            </p>

            {/* Enhanced search bar */}
            <div className="max-w-2xl mx-auto relative mb-8 animate-slide-in-left">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search Web3 projects, protocols, or categories..."
                className="showcase-input pl-14 pr-6 py-4 text-lg border-2 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Enhanced stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm md:text-base animate-scale-in">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">{projects.length}</span>
                <span className="text-gray-600">Projects Found</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">{projects.reduce((sum, p) => sum + p.views, 0).toLocaleString()}</span>
                <span className="text-gray-600">Total Views</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filters and Controls */}
      <section className="section-padding-sm bg-gradient-subtle">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Enhanced Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="showcase-input w-48 border-2">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-elevation-2">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="rounded-lg">
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="showcase-input w-48 border-2">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-elevation-2">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="rounded-lg">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="showcase-btn-outline lg:hidden rounded-xl"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Enhanced View Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-xl ${viewMode === 'grid' ? 'showcase-btn' : 'showcase-btn-outline'}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`rounded-xl ${viewMode === 'list' ? 'showcase-btn' : 'showcase-btn-outline'}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Projects Grid/List */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-6">
                <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-2xl font-bold mb-3 font-display text-gray-900">No projects found</h3>
              <p className="text-gray-600 text-lg mb-6">
                Try adjusting your search terms or filters to find more projects.
              </p>
              <Button asChild>
                <Link href="/submit">Submit the First Project</Link>
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
            }>
              {projects.map((project, index) => (
                <Card
                  key={project.id}
                  className={`showcase-project-card cursor-pointer group animate-scale-in ${
                    viewMode === 'list' ? 'flex flex-row' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleProjectClick(project.slug, project.owner?.username || 'demo')}
                >
                  <CardHeader className={viewMode === 'list' ? 'flex-1 pb-4' : 'pb-4'}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-14 w-14 border-2 border-gray-200 shadow-elevation-1">
                          <AvatarImage src={project.logo_url} alt={project.title} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-lg">
                            {project.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl font-display text-gray-900 group-hover:text-primary transition-colors duration-200">
                            {project.title}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-medium text-xs">
                              {project.categories?.name || 'Web3'}
                            </Badge>
                            {project.is_featured && (
                              <Trophy className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="mb-6 text-base leading-relaxed text-gray-600 line-clamp-2">
                      {project.description}
                    </CardDescription>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs border-gray-200 text-gray-600 bg-gray-50 font-medium">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-200 text-gray-600 bg-gray-50 font-medium">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span className="text-xs">{project.owner?.displayName || project.owner?.username || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ExternalLink className="h-4 w-4" />
                          <span>{project.views.toLocaleString()} views</span>
                        </div>
                      </div>
                      <Button size="sm" className="showcase-btn px-4 py-2 text-xs font-semibold">
                        View Project
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}