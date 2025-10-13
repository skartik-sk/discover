'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Star,
  Users,
  Eye,
  Trophy,
  Calendar,
  Settings,
  ExternalLink,
  Heart,
  MessageSquare,
  Zap,
  Shield,
  TrendingUp,
  Award,
  Gift,
  Rocket,
  PlusCircle,
  Edit,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface UserData {
  profile: {
    id: string
    email: string
    name: string
    username: string
    avatar: string | null
    bio: string
    role: string
    wallet_address: string | null
    is_verified: boolean
    created_at: string
    updated_at: string
  }
  stats: {
    projects_submitted: number
    total_views: number
    total_tags: number
    featured_projects: number
  }
  projects: Array<{
    id: string
    title: string
    slug: string
    description: string
    logo_url: string | null
    website_url: string | null
    github_url: string | null
    is_featured: boolean
    views: number
    created_at: string
    updated_at: string
    category: {
      name: string
      slug: string
      color: string
    } | null
    tags: string[]
  }>
  recent_activity: any[]
}

export default function DashboardPage() {
  const { user, session, loading: authLoading, getAuthHeaders } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({
    bio: '',
    username: ''
  })

  useEffect(() => {
    if (authLoading) return
    if (!session) {
      window.location.href = '/auth/signin'
      return
    }

    fetchUserData()
  }, [session, authLoading])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const authHeaders = {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      }
      const response = await fetch('/api/dashboard', {
        headers: authHeaders
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const data = await response.json()
      setUserData(data)
      setEditForm({
        bio: data.profile.bio,
        username: data.profile.username
      })
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = () => {
    if (!userData) return
    setUserData({
      ...userData,
      profile: {
        ...userData.profile,
        bio: editForm.bio,
        username: editForm.username
      }
    })
    setIsEditingProfile(false)
  }

  const handleEditProfile = () => {
    if (!userData) return
    setEditForm({
      bio: userData.profile.bio,
      username: userData.profile.username
    })
    setIsEditingProfile(true)
  }

  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full showcase-project-card shadow-elevation-2">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground mb-4">
              Please sign in to access your dashboard.
            </p>
            <Button asChild>
              <a href="/auth/signin">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full showcase-project-card shadow-elevation-2">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              {error || 'Failed to load dashboard data. Please try again.'}
            </p>
            <Button onClick={fetchUserData} className="mb-2">Retry</Button>
            <Button variant="outline" asChild className="ml-2">
              <a href="/projects">Browse Projects</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen showcase-theme">
      {/* Header */}
      <div className="showcase-hero section-padding-xs lg:section-padding">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24 border-4 bg-white shadow-elevation-2">
                <AvatarImage src={userData.profile.avatar || ''} alt={userData.profile.name} />
                <AvatarFallback className="text-2xl">{userData.profile.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">{userData.profile.name}</h1>
                  {userData.profile.is_verified && (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                  <Badge className="showcase-badge capitalize">
                    {userData.profile.role}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">@{userData.profile.username}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Member since {new Date(userData.profile.created_at).toLocaleDateString()}
                </p>

                {!isEditingProfile ? (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleEditProfile} className="showcase-btn-outline border-2">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button asChild className="showcase-btn-outline border-2">
                      <Link href="/submit">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Submit Project
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Input
                      placeholder="Username"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      className="showcase-input border-2"
                    />
                    <Textarea
                      placeholder="Bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="showcase-input resize-none border-2"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="showcase-btn">Save</Button>
                      <Button onClick={() => setIsEditingProfile(false)} className="showcase-btn-outline border-2">Cancel</Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{userData.stats.projects_submitted}</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{userData.stats.total_views}</div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{userData.stats.total_tags}</div>
                  <div className="text-sm text-muted-foreground">Tags</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{userData.stats.featured_projects}</div>
                  <div className="text-sm text-muted-foreground">Featured</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="nfts">NFT Rewards</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 showcase-project-card shadow-elevation-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Your Project Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Projects Submitted</span>
                        <span className="font-semibold">{userData.stats.projects_submitted}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Views Generated</span>
                        <span className="font-semibold">{userData.stats.total_views.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Tags Used</span>
                        <span className="font-semibold">{userData.stats.total_tags}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Featured Projects</span>
                        <span className="font-semibold">{userData.stats.featured_projects}</span>
                      </div>
                      {userData.stats.projects_submitted > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Average Views per Project</span>
                          <span className="font-semibold">
                            {Math.round(userData.stats.total_views / userData.stats.projects_submitted)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button asChild className="w-full">
                      <Link href="/submit">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Submit New Project
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/projects">
                        <Rocket className="h-4 w-4 mr-2" />
                        Explore Projects
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/categories">
                        <Trophy className="h-4 w-4 mr-2" />
                        Browse Categories
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/u/${userData.profile.username}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Public Profile
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {userData.projects.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                    <CardDescription>Your latest project submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {userData.projects.slice(0, 6).map((project) => (
                        <Card key={project.id} className="showcase-project-card cursor-pointer group">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={project.logo_url || ''} alt={project.title} />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm">
                                  {project.title.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{project.title}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {project.category?.name || 'Uncategorized'}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                              {project.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                <span>{project.views}</span>
                              </div>
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/projects/${userData.profile.username}/${project.slug}`}>
                                  <ExternalLink className="h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Your Projects ({userData.projects.length})
                  </CardTitle>
                  <CardDescription>
                    Projects you've submitted to the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.projects.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <Rocket className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                      <p className="text-gray-600 mb-4">
                        Submit your first project to start building your Web3 portfolio.
                      </p>
                      <Button asChild>
                        <Link href="/submit">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Submit Your First Project
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userData.projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg group">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={project.logo_url || ''} alt={project.title} />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                                {project.title.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium group-hover:text-primary transition-colors">
                                  {project.title}
                                </h4>
                                {project.is_featured && (
                                  <Trophy className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {project.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {project.category.name}
                                  </Badge>
                                )}
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {project.views} views
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(project.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {project.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {project.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{project.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/projects/${userData.profile.username}/${project.slug}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* NFTs Tab */}
            <TabsContent value="nfts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    NFT Rewards
                  </CardTitle>
                  <CardDescription>
                    Exclusive NFTs earned as an early tester (Coming Soon)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">NFT Rewards Coming Soon</h3>
                    <p className="text-gray-600 mb-4">
                      Earn exclusive NFTs by testing and reviewing Web3 projects.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Start submitting and reviewing projects to unlock NFT rewards!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Achievements
                  </CardTitle>
                  <CardDescription>
                    Unlock achievements by participating in the community (Coming Soon)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Award className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Achievements System Coming Soon</h3>
                    <p className="text-gray-600 mb-4">
                      Earn badges and recognition for your contributions to the Web3 community.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                      <div className="text-center p-4 border rounded-lg">
                        <Rocket className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-medium text-sm">Early Adopter</h4>
                        <p className="text-xs text-muted-foreground mt-1">Submit your first project</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-medium text-sm">Project Contributor</h4>
                        <p className="text-xs text-muted-foreground mt-1">Submit 5+ projects</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-medium text-sm">Featured Creator</h4>
                        <p className="text-xs text-muted-foreground mt-1">Get featured projects</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Activity Tracking Coming Soon</h3>
                    <p className="text-gray-600 mb-4">
                      Track your project submissions, views, and community interactions.
                    </p>
                    <div className="space-y-2 max-w-md mx-auto">
                      <div className="flex items-center justify-between p-3 border rounded-lg text-sm">
                        <div className="flex items-center space-x-3">
                          <Rocket className="h-5 w-5 text-primary" />
                          <span>Projects submitted: {userData.stats.projects_submitted}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg text-sm">
                        <div className="flex items-center space-x-3">
                          <Eye className="h-5 w-5 text-primary" />
                          <span>Total views: {userData.stats.total_views.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg text-sm">
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-primary" />
                          <span>Member since: {new Date(userData.profile.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}