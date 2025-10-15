'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Search,
  Filter,
  Grid,
  List,
  ArrowRight,
  Rocket
} from 'lucide-react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryCard } from '@/components/cards/category-card'

interface Category {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  color: string
  gradient: string
  projects_count: number
  is_active: boolean
  created_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredCategories(filtered)
  }, [categories, searchQuery])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')

      const data = await response.json()
      setCategories(data)
      setFilteredCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-8">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-10 w-full max-w-md mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-6 border border-gray-200">
                  <Skeleton className="h-8 w-8 mb-4 rounded-full" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-20" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="showcase-hero section-padding-xs">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-float inline-flex items-center mb-6">
              <Badge className="showcase-badge">
                <Filter className="w-3 h-3 mr-2" />
                Browse by Category
              </Badge>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gradient-primary mb-6 animate-fade-in-up">
              Explore
              <br />
              <span className="text-gradient-accent">Web3 Categories</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover innovative Web3 projects organized by category. From DeFi to NFTs, find what interests you.
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search categories..."
                className="showcase-input pl-12 pr-4 py-4 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-base">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-900">{filteredCategories.length}</span>
                <span className="text-gray-600">Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-900">{categories.reduce((acc, cat) => acc + cat.projects_count, 0)}</span>
                <span className="text-gray-600">Projects</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb and Controls */}
      <section className="py-4 bg-white border-b-2 border-gray-100">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <ArrowRight className="h-3 w-3" />
              <span className="font-semibold text-gray-900">Categories</span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 shadow-inner">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-elevation-2' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <Grid className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-elevation-2' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid/List */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                <Filter className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">No categories found</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                Try adjusting your search terms to find more categories.
              </p>
              <Button
                onClick={() => setSearchQuery('')}
                className="showcase-btn-outline"
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6 max-w-4xl mx-auto'
            }>
              {filteredCategories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  viewMode={viewMode}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 border-t-2 border-gray-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-6 shadow-elevation-3">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Can't Find Your Category?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Submit your project to be featured in our directory and reach thousands of Web3 enthusiasts
            </p>
            <Button
              size="lg"
              className="showcase-btn px-8 py-4 text-base font-semibold shadow-elevation-3"
              asChild
            >
              <Link href="/submit">
                <Rocket className="mr-2 h-5 w-5" />
                Submit Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}