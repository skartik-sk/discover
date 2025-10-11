'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, Eye, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    logo_url?: string
    views: number
    is_featured?: boolean
    tags: string[]
    categories?: {
      name: string
    }
    owner?: {
      displayName?: string
      username?: string
    }
  }
  username?: string
  slug: string
}

export function ProjectCard({ project, username, slug }: ProjectCardProps) {
  return (
    <Link href={`/projects/${username || 'demo'}/${slug}`}>
      <Card className="showcase-project-card cursor-pointer group animate-scale-in h-full">
        <CardHeader className="pb-4">
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
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-medium">
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
          <CardDescription className="mb-6 text-base leading-relaxed text-gray-600">
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
                <Eye className="h-4 w-4" />
                <span>{project.views || 0}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span className="text-xs">{project.owner?.displayName || project.owner?.username || 'Anonymous'}</span>
              </div>
            </div>
            <Button size="sm" className="showcase-btn px-4 py-2 text-xs font-semibold">
              View Project
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}