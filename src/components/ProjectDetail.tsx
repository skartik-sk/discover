'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProjectDetailSkeleton from './ProjectDetailSkeleton'
import { trackPageView, trackProjectInteraction, useAnalytics } from '@/lib/analytics'
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Star,
  Eye,
  Tag,
  Calendar,
  User,
  Heart,
  Share2,
  Copy,
  Check,
  TrendingUp,
  Award,
  Zap,
  MessageSquare,
  ThumbsUp,
  Clock,
  Link2,
  Shield,
  Sparkles,
  ArrowUpRight,
  Users,
  BarChart3,
  Trophy,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import AsyncErrorBoundary from './AsyncErrorBoundary'

interface ProjectDetailProps {
  project: {
    id: string
    title: string
    description: string
    logo_url: string
    website_url: string
    github_url: string
    views: number
    created_at: string
    updated_at?: string
    is_featured?: boolean
    tags: string[]
    owner: {
      id: string
      username: string
      displayName: string
      avatarUrl: string
      bio: string
    }
    categories: {
      id: string
      name: string
      slug: string
      color: string
      gradient: string
    }
    reviews: Array<{
      id: string
      rating: number
      review_text: string
      created_at: string
      users: {
        username: string
        display_name: string
        avatar_url: string
      }
    }>
  }
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Track page view when component mounts
    trackPageView(`project-${project.id}`, project.title)

    // Track view in database
    const trackView = async () => {
      try {
        await fetch(`/api/projects/${project.id}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        console.error('Error tracking view:', error)
      }
    }

    trackView()

    // Simulate loading delay for skeleton
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
      // Simulate like count based on views
      setLikeCount(Math.floor(project.views * 0.3))
    }, 800)

    return () => {
      clearTimeout(loadingTimer)
    }
  }, [project.id, project.title])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const averageRating = project.reviews.length > 0
    ? project.reviews.reduce((sum, review) => sum + review.rating, 0) / project.reviews.length
    : 0

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiedToClipboard(true)
      setTimeout(() => setCopiedToClipboard(false), 2000)

      // Track share event
      trackProjectInteraction(project.id, 'share', {
        method: 'clipboard',
        url: window.location.href
      })
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)

    // Track like/unlike event
    trackProjectInteraction(project.id, 'like', {
      action: isLiked ? 'unlike' : 'like',
      totalLikes: isLiked ? likeCount - 1 : likeCount + 1
    })
  }

  // Generate structured data for SEO
  const generateStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const projectUrl = `${baseUrl}/projects/${project.owner.username}/${project.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')}`

    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: project.title,
      description: project.description,
      url: projectUrl,
      applicationCategory: 'Web3Application',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      creator: {
        '@type': 'Person',
        name: project.owner.displayName || project.owner.username,
        url: `${baseUrl}/u/${project.owner.username}`
      },
      dateCreated: project.created_at,
      dateModified: project.updated_at || project.created_at,
      keywords: project.tags?.join(', '),
      aggregateRating: project.reviews.length > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: project.reviews.length,
        bestRating: '5',
        worstRating: '1'
      } : undefined,
      image: project.logo_url,
      screenshot: `${baseUrl}/api/og/projects/${project.id}`,
      downloadUrl: project.website_url,
      softwareVersion: '1.0.0',
      releaseNotes: 'Initial release of this Web3 project',
      license: 'https://creativecommons.org/licenses/by/4.0/',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      programmingLanguage: ['JavaScript', 'TypeScript', 'Solidity'],
      features: [
        'Web3 Integration',
        'Blockchain Technology',
        'Decentralized',
        'Smart Contracts',
        'Crypto Wallet Support'
      ],
      audience: {
        '@type': 'Audience',
        audienceType: 'Web3 enthusiasts, blockchain developers, crypto investors'
      },
      provider: {
        '@type': 'Organization',
        name: 'Web3 Project Hunt',
        url: baseUrl
      }
    }
  }

  // Show skeleton while loading
  if (isLoading) {
    return <ProjectDetailSkeleton />
  }

  const structuredData = generateStructuredData()

  return (
    <AsyncErrorBoundary maxRetries={2}>
      <>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="min-h-screen bg-background" id="top">
        <div className="container-custom section-padding">
          {/* Back Navigation */}
          <Link
            href="/projects"
            className="inline-flex items-center text-gray-600 hover:text-primary mb-6 group transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to Projects</span>
          </Link>

          {/* Project Header */}
          <div className="showcase-card-hover p-6 lg:p-8 mb-8 animate-scale-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Project Logo */}
              <div className="lg:col-span-2 flex justify-center lg:justify-start mb-6 lg:mb-0">
                <Avatar className="h-20 w-20 border-2 border-gray-200 shadow-elevation-1">
                  <AvatarImage src={project.logo_url} alt={project.title} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-xl">
                    {project.title.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Main Project Info */}
              <div className="lg:col-span-7 text-center lg:text-left">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-medium text-xs">
                        {project.categories?.name || 'Web3'}
                      </Badge>
                      {project.is_featured && (
                        <Trophy className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-display group-hover:text-primary transition-colors duration-200">
                      {project.title}
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, index) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs border-gray-200 text-gray-600 bg-gray-50 font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start">
                  {project.website_url && (
                    <Button asChild className="showcase-btn px-6 py-3 text-sm font-semibold">
                      <a
                        href={project.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit project website"
                        onClick={() => trackProjectInteraction(project.id, 'click', {
                          type: 'website',
                          url: project.website_url
                        })}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button variant="outline" asChild className="showcase-btn-outline px-6 py-3 text-sm font-semibold border-2">
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View GitHub repository"
                        onClick={() => trackProjectInteraction(project.id, 'click', {
                          type: 'github',
                          url: project.github_url
                        })}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="showcase-btn-outline px-6 py-3 text-sm font-semibold border-2 w-full sm:w-auto"
                    aria-label={copiedToClipboard ? "Link copied to clipboard" : "Copy project link"}
                  >
                    {copiedToClipboard ? (
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {copiedToClipboard ? 'Copied!' : 'Share'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLike}
                    className={`showcase-btn-outline px-6 py-3 text-sm font-semibold border-2 w-full sm:w-auto ${
                      isLiked ? 'bg-red-50 border-red-500 text-red-600' : ''
                    }`}
                    aria-label={`${isLiked ? 'Unlike' : 'Like'} this project`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {likeCount}
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:space-y-3">
                  <div className="showcase-stat-card p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Views</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{project.views.toLocaleString()}</div>
                  </div>

                  <div className="showcase-stat-card p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">Rating</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                    <p className="text-sm text-gray-600">{project.reviews.length} reviews</p>
                  </div>

                  <div className="showcase-stat-card p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">Likes</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{likeCount.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="showcase-card-hover p-6">
              <CardContent className="pt-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Created</h3>
                <p className="text-gray-600">{formatDate(project.created_at)}</p>
              </CardContent>
            </Card>

            <Card className="showcase-card-hover p-6">
              <CardContent className="pt-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Owner</h3>
                <p className="text-gray-600">{project.owner.displayName || project.owner.username}</p>
              </CardContent>
            </Card>

            <Card className="showcase-card-hover p-6">
              <CardContent className="pt-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Views</h3>
                <p className="text-gray-600">{project.views.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Reviews Section */}
          <Card className="showcase-card-hover p-8 mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Reviews</CardTitle>
              <p className="text-gray-600">{project.reviews.length} {project.reviews.length === 1 ? 'Review' : 'Reviews'}</p>
            </CardHeader>
            <CardContent>
              {project.reviews.length > 0 ? (
                <div className="space-y-6">
                  {project.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={review.users.avatar_url} alt={review.users.display_name} />
                          <AvatarFallback>
                            {review.users.display_name?.charAt(0) || review.users.username?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">
                              {review.users.display_name || review.users.username}
                            </span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.review_text && (
                            <p className="text-gray-600 text-sm">{review.review_text}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No reviews yet. Be the first to review this project!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Owner & Category Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Owner Card */}
            <Card className="showcase-card-hover p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Project Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage src={project.owner.avatarUrl} alt={project.owner.displayName} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-xl">
                      {project.owner.displayName?.charAt(0) || project.owner.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {project.owner.displayName || project.owner.username}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">@{project.owner.username}</p>

                  {project.owner.bio && (
                    <p className="text-sm text-gray-600 mb-4">{project.owner.bio}</p>
                  )}

                  <Link href={`/u/${project.owner.username}`}>
                    <Button className="showcase-btn w-full">
                      <Users className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Category Card */}
            {project.categories && (
              <Card className="showcase-card-hover p-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-accent" />
                    Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/categories/${project.categories.slug}`} className="block">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:border-primary transition-colors duration-200">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${project.categories.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                        {project.categories.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{project.categories.name}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      </>
    </AsyncErrorBoundary>
  )
}