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
  // Extract gradient colors for icon background
  const gradientClass = category.gradient || 'from-blue-500 to-cyan-500'
  
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card
        className={`showcase-card-hover cursor-pointer group ${
          viewMode === 'list' ? 'flex flex-row items-center' : ''
        }`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <CardContent className="p-6">
          <div className={viewMode === 'list' ? 'flex items-center space-x-6' : 'text-center'}>
            {/* Icon */}
            <div className={`flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${gradientClass} shadow-elevation-2 ${viewMode === 'list' ? '' : 'mb-5 mx-auto'}`}>
              <span className="text-2xl">
                {category.icon || category.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className={viewMode === 'list' ? 'flex-1 text-left' : ''}>
              {/* Title */}
              <h3 className={`font-display font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors ${viewMode === 'list' ? 'text-xl' : 'text-lg'}`}>
                {category.name}
              </h3>
              
              {/* Description */}
              <p className={`text-gray-600 leading-relaxed ${viewMode === 'list' ? 'text-base mb-2' : 'text-sm mb-4'}`}>
                {category.description}
              </p>
              
              {/* Project Count Badge */}
              <div className={`flex items-center ${viewMode === 'list' ? 'justify-start' : 'justify-center'} gap-2`}>
                <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg">
                  <span className="text-sm font-semibold text-blue-700">
                    {category.projects_count} {category.projects_count === 1 ? 'project' : 'projects'}
                  </span>
                </div>
              </div>
            </div>

            {viewMode === 'grid' && (
              <div className="flex justify-center mt-4 pt-4 border-t border-gray-100">
                <span className="text-blue-600 text-sm font-semibold group-hover:text-blue-700 flex items-center gap-1">
                  Explore Projects
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}