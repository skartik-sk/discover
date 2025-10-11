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
  ArrowRight
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
    <div className="min-h-screen bg-white">
      {/* Simplified Header Section */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            {/* Simple heading */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Categories
            </h1>

            {/* Simple description */}
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Browse projects by category to find what interests you
            </p>

            {/* Clean search bar */}
            <div className="max-w-xl mx-auto relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search categories..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Simple stats */}
            <div className="flex justify-center gap-8 text-sm text-gray-600">
              <span className="font-medium text-gray-900">{filteredCategories.length} Categories</span>
              <span>•</span>
              <span className="font-medium text-gray-900">{categories.reduce((acc, cat) => acc + cat.projects_count, 0)} Projects</span>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Breadcrumb and Controls */}
      <section className="py-4 bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
              <span>/</span>
              <span className="font-medium text-gray-900">Categories</span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid/List */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <Filter className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No categories found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms to find more categories.
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
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
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

      {/* Simple CTA Section */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Can't Find Your Category?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Submit your project to be featured in our directory and reach thousands of enthusiasts
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              asChild
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