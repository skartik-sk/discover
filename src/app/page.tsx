import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Star,
  Users,
  Rocket,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Trophy,
  Eye,
  Heart,
  Sparkles,
  Code,
  Palette,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// Icon mapping for categories
const categoryIcons: Record<string, any> = {
  'defi': Shield,
  'nft': Trophy,
  'gaming': Rocket,
  'dao': Users,
  'infrastructure': Code,
  'education': Palette,
  'other': Globe
}

// Light color mapping for category icons
const categoryColors: Record<string, { bg: string, text: string }> = {
  'defi': { bg: 'from-blue-50 to-blue-100', text: 'text-blue-600' },
  'nft': { bg: 'from-purple-50 to-purple-100', text: 'text-purple-600' },
  'gaming': { bg: 'from-red-50 to-red-100', text: 'text-red-600' },
  'dao': { bg: 'from-green-50 to-green-100', text: 'text-green-600' },
  'infrastructure': { bg: 'from-orange-50 to-orange-100', text: 'text-orange-600' },
  'education': { bg: 'from-pink-50 to-pink-100', text: 'text-pink-600' },
  'other': { bg: 'from-gray-50 to-gray-100', text: 'text-gray-600' }
}

// Get data from Supabase
async function getFeaturedProjects() {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          color,
          gradient,
          icon
        ),
        tags:project_tags (
          tag_name
        )
      `)
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Error fetching featured projects:', error)
      return []
    }

    // Get user IDs from projects and fetch user data
    const userIds = [...new Set(projects.map(p => p.user_id).filter(Boolean))]
    let usersData: any[] = []

    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, username, display_name')
        .in('id', userIds)
      usersData = users || []
    }

    return projects.map(project => {
      const user = usersData.find(u => u.id === project.user_id)

      // Generate slug if it doesn't exist
      let projectSlug = project.slug
      if (!projectSlug) {
        projectSlug = project.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }

      return {
        ...project,
        slug: projectSlug,
        tags: project.tags?.map((tag: any) => tag.tag_name) || [],
        owner: {
          username: user?.username || 'demo',
          displayName: user?.display_name || 'Demo User'
        }
      }
    })
  } catch (error) {
    console.error('Error in getFeaturedProjects:', error)
    return []
  }
}

async function getCategories() {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    // Get project counts for each category
    const categoryIds = categories.map(c => c.id)
    let projectCounts: any[] = []

    if (categoryIds.length > 0) {
      const { data: projects } = await supabase
        .from('projects')
        .select('category_id')
        .eq('is_active', true)
        .in('category_id', categoryIds)

      // Count projects per category
      projectCounts = categoryIds.map(id => ({
        category_id: id,
        count: projects?.filter(p => p.category_id === id).length || 0
      }))
    }

    return categories.map(category => {
      const countData = projectCounts.find(pc => pc.category_id === category.id)
      return {
        ...category,
        icon: categoryIcons[category.slug] || Globe,
        projects_count: countData?.count || 0
      }
    })
  } catch (error) {
    console.error('Error in getCategories:', error)
    return []
  }
}

async function getStats() {
  try {
    // Get real counts
    const [projectsResult, usersResult, categoriesResult, viewsResult] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('categories').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('projects').select('views').eq('is_active', true)
    ])

    const projectsCount = projectsResult.count || 0
    const usersCount = usersResult.count || 0
    const categoriesCount = categoriesResult.count || 0

    // Calculate total views - ensure viewsData is an array
    const viewsData = viewsResult.data || []
    const totalViews = viewsData.reduce((sum, project) => sum + (project.views || 0), 0)

    return [
      { label: "Projects Showcased", value: projectsCount.toLocaleString(), icon: Rocket, color: "text-primary", bgGradient: "from-primary/10 to-primary/5" },
      { label: "Active Creators", value: usersCount.toLocaleString(), icon: Users, color: "text-accent", bgGradient: "from-accent/10 to-accent/5" },
      { label: "Total Views", value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews.toString(), icon: Eye, color: "text-purple-500", bgGradient: "from-purple-50 to-purple-100" },
      { label: "Categories", value: categoriesCount.toString(), icon: Globe, color: "text-green-500", bgGradient: "from-green-50 to-green-100" }
    ]
  } catch (error) {
    console.error('Error in getStats:', error)
    return [
      { label: "Projects Showcased", value: "0", icon: Rocket, color: "text-primary", bgGradient: "from-primary/10 to-primary/5" },
      { label: "Active Creators", value: "0", icon: Users, color: "text-accent", bgGradient: "from-accent/10 to-accent/5" },
      { label: "Total Views", value: "0", icon: Eye, color: "text-purple-500", bgGradient: "from-purple-50 to-purple-100" },
      { label: "Categories", value: "0", icon: Globe, color: "text-green-500", bgGradient: "from-green-50 to-green-100" }
    ]
  }
}

export default async function Home() {
  const [featuredProjects, categories, stats] = await Promise.all([
    getFeaturedProjects(),
    getCategories(),
    getStats()
  ])

  
  return (
    <div className="min-h-screen showcase-theme">
      {/* Enhanced Hero Section */}
      <section className="showcase-hero section-padding-xs lg:section-padding">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            {/* Floating badge */}
            <div className="animate-float inline-flex items-center mb-8">
              <Badge className="showcase-badge animate-pulse-slow">
                <Sparkles className="w-3 h-3 mr-2" />
                ⚡ Discover Web3 Innovations
              </Badge>
            </div>

            {/* Enhanced heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-gradient-primary mb-6 animate-fade-in-up text-balance">
              Discover Your
              <br />
              <span className="text-gradient-accent">Web3 Projects</span>
            </h1>

            {/* Enhanced description */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-in-left leading-relaxed text-balance">
              Join thousands of Web3 builders discovering innovative decentralized projects.
              <br className="hidden md:block" />
              Get discovered, attract users, and grow your Web3 ecosystem.
            </p>

            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-scale-in">
              <Button size="lg" className="showcase-btn px-8 py-4 text-base font-semibold shadow-elevation-3 hover:shadow-elevation-4" asChild>
                <Link href="/projects">
                  Explore Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="showcase-btn-outline px-8 py-4 text-base font-semibold border-2" asChild>
                <Link href="/submit">
                  Submit Your Work
                </Link>
              </Button>
            </div>

            {/* Enhanced search bar */}
            <div className="max-w-2xl mx-auto relative animate-slide-in-left">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search Web3 projects, protocols, or categories..."
                className="showcase-input pl-14 pr-6 py-4 text-lg border-2 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="section-padding-sm bg-gradient-subtle">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="showcase-stat-card p-6 group hover:shadow-elevation-3">
                <CardContent className="pt-0">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 font-display animate-fade-in-up">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-medium mt-1">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-gray-900">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Explore innovative Web3 projects across different blockchain categories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              const colors = categoryColors[category.slug] || categoryColors.other
              return (
                <Link key={index} href={`/categories/${category.slug}`}>
                  <Card className="showcase-category-card group p-6">
                    <CardContent className="p-0 text-center">
                      <div className={`icon-wrapper bg-gradient-to-br ${colors.bg}`}>
                        <IconComponent className={`h-8 w-8 ${colors.text}`} />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-primary transition-colors duration-200">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">
                        {category.projects_count || 0} projects
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="section-padding bg-gradient-subtle">
          <div className="container-custom">
            <div className="text-center mb-16">
              <div className="animate-float inline-flex items-center mb-6">
                <Badge className="showcase-badge">
                  <Trophy className="w-3 h-3 mr-2" />
                  ⭐ Featured Projects
                </Badge>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-gray-900">
                Trending This Week
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Hand-picked exceptional projects that are gaining traction in our community
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <Link key={project.id} href={`/projects/${project.owner?.username || 'demo'}/${project.slug}`}>
                  <Card
                    className="showcase-project-card cursor-pointer group animate-scale-in h-full"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
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
              ))}
            </div>

            <div className="text-center mt-16">
              <Button size="lg" variant="outline" className="showcase-btn-outline px-8 py-4 text-base font-semibold border-2" asChild>
                <Link href="/projects">
                  View All Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Features Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-gray-900">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The ultimate platform for Web3 creators to showcase their innovative projects
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="showcase-card-hover p-8 group">
              <CardContent className="pt-0 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 font-display text-gray-900 group-hover:text-primary transition-colors duration-200">
                  Get Discovered
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Reach thousands of potential users and collaborators looking for innovative Web3 projects like yours
                </p>
              </CardContent>
            </Card>

            <Card className="showcase-card-hover p-8 group">
              <CardContent className="pt-0 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 font-display text-gray-900 group-hover:text-accent transition-colors duration-200">
                  Quality Projects
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Join a curated community of high-quality Web3 projects and innovative decentralized applications
                </p>
              </CardContent>
            </Card>

            <Card className="showcase-card-hover p-8 group">
              <CardContent className="pt-0 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 font-display text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                  Build Your Brand
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Create a stunning portfolio that showcases your unique Web3 projects and technical expertise
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/90"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-display">
              Ready to Showcase Your Web3 Projects?
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Join thousands of Web3 creators building their portfolios and growing their communities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button size="lg" className="showcase-btn px-8 py-4 text-base font-semibold shadow-elevation-3 hover:shadow-elevation-4" asChild>
                 <Link href="/submit">
                  Submit Your Project
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-base font-semibold" asChild>
                <Link href="/projects">
                  Explore Projects
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}