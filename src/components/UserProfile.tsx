'use client'

import Link from 'next/link'
import { Calendar, ExternalLink, Github, MapPin, Twitter, Globe, User as UserIcon, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserProfileProps {
  user: {
    id: string
    username: string
    display_name: string
    avatar_url: string
    bio: string
    website: string
    twitter: string
    github: string
    created_at: string
    role: string
  }
  projects: Array<{
    id: string
    title: string
    description: string
    logo_url: string
    website_url: string
    github_url: string
    slug: string
    created_at: string
    views: number
    is_featured: boolean
    tags: string[]
    categories: {
      id: string
      name: string
      slug: string
      color: string
      gradient: string
    }
  }>
}

export default function UserProfile({ user, projects }: UserProfileProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const totalViews = projects.reduce((sum, project) => sum + project.views, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar_url} alt={user.display_name} />
              <AvatarFallback className="text-2xl">
                {user.display_name?.charAt(0) || user.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {user.display_name || user.username}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    @{user.username} • {user.role}
                  </p>
                </div>

                <div className="flex space-x-2 mt-4 sm:mt-0">
                  {user.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={user.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {user.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {user.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {user.bio && (
                <p className="text-slate-700 dark:text-slate-300 mb-4 max-w-3xl">
                  {user.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(user.created_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Package className="w-4 h-4" />
                  <span>{projects.length} Projects</span>
                </div>
                <div className="flex items-center space-x-1">
                  <UserIcon className="w-4 h-4" />
                  <span>{totalViews.toLocaleString()} Total Views</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Projects ({projects.length})
            </h2>

            {projects.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Sort by:
                </span>
                <Button variant="outline" size="sm">
                  Latest
                </Button>
              </div>
            )}
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={project.logo_url || '/api/placeholder/48/48'}
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <Link href={`/projects/${user.username}/${project.slug}`}>
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                            {project.title}
                            {project.is_featured && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Featured
                              </Badge>
                            )}
                          </h3>
                        </Link>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                      <Link
                        href={`/categories/${project.categories.slug}`}
                        className="inline-flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      >
                        <div className={`w-4 h-4 rounded bg-gradient-to-r ${project.categories.gradient}`}></div>
                        <span>{project.categories.name}</span>
                      </Link>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-500">
                        <span className="flex items-center space-x-1">
                          <UserIcon className="w-3 h-3" />
                          <span>{project.views.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(project.created_at)}</span>
                        </span>
                      </div>

                      <div className="flex space-x-1">
                        {project.website_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={project.website_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                        {project.github_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                              <Github className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No projects yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {user.display_name || user.username} hasn't published any projects yet.
                </p>
                <Button asChild>
                  <Link href="/submit">Submit a Project</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}