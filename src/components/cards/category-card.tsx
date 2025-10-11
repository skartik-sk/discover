'use client'

import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

interface CategoryCardProps {
  category: {
    id: string
    slug: string
    name: string
    description: string
    projects_count: number
    gradient?: string
    icon?: string
  }
  viewMode?: 'grid' | 'list'
  index?: number
}

export function CategoryCard({ category, viewMode = 'grid', index = 0 }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card
        className={`border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer group ${
          viewMode === 'list' ? 'flex flex-row items-center' : ''
        }`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <CardContent className="p-6">
          <div className={viewMode === 'list' ? 'flex items-center space-x-4' : 'text-center'}>
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 ${viewMode === 'list' ? '' : 'mb-4 mx-auto'}`}>
              <span className="text-xl font-semibold text-gray-600">
                {category.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className={viewMode === 'list' ? 'flex-1 text-left' : ''}>
              <h3 className={`font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors ${viewMode === 'list' ? 'text-lg' : ''}`}>
                {category.name}
              </h3>
              <p className={`text-gray-600 text-sm mb-3 ${viewMode === 'list' ? 'mb-0' : ''}`}>
                {category.description}
              </p>
              <div className="flex items-center justify-center md:justify-start space-x-1 text-sm text-gray-500">
                <span>{category.projects_count} projects</span>
              </div>
            </div>

            {viewMode === 'grid' && (
              <div className="flex justify-center mt-2">
                <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">View Projects →</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}