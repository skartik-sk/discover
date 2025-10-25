import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Search,
  Star,
  Users,
  Rocket,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Trophy,
  Eye,
  TrendingUp,
  Globe,
  Play,
  ChevronRight,
  Code,
  Layers,
  CheckCircle,
  Award,
  Target,
  Lightbulb,
  BarChart
} from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const categoryIcons: Record<string, any> = {
  'defi': Shield,
  'nft': Trophy,
  'gaming': Rocket,
  'dao': Users,
  'infrastructure': Globe,
  'education': Star,
  'other': Sparkles
}

async function fetchFeaturedProjects() {
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

    if (error) return []

    const userIds = [...new Set(projects.map(p => p.creator_id).filter(Boolean))]
    let usersData: any[] = []

    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, username, display_name')
        .in('id', userIds)
      
      usersData = users || []
    }

    return projects.map(project => {
      const user = usersData.find(u => u.id === project.creator_id)
      const projectSlug = project.slug || project.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

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
    return []
  }
}

async function fetchCategories() {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    return categories || []
  } catch (error) {
    return []
  }
}

async function fetchPlatformStats() {
  try {
    const [projectsResult, usersResult, categoriesResult, viewsResult] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('categories').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('projects').select('views').eq('is_active', true)
    ])

    const projectsCount = projectsResult.count || 0
    const usersCount = usersResult.count || 0
    const categoriesCount = categoriesResult.count || 0
    const viewsData = viewsResult.data || []
    const totalViews = viewsData.reduce((sum, project) => sum + (project.views || 0), 0)

    return [
      { 
        label: "Active Projects", 
        value: projectsCount.toLocaleString(), 
        icon: Rocket, 
        gradient: "from-purple-500 via-purple-600 to-pink-500" 
      },
      { 
        label: "Web3 Builders", 
        value: usersCount.toLocaleString(), 
        icon: Users, 
        gradient: "from-blue-500 via-blue-600 to-cyan-500" 
      },
      { 
        label: "Total Views", 
        value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K+` : totalViews.toString(), 
        icon: Eye, 
        gradient: "from-green-500 via-green-600 to-emerald-500" 
      },
      { 
        label: "Categories", 
        value: categoriesCount.toString(), 
        icon: Globe, 
        gradient: "from-orange-500 via-orange-600 to-red-500" 
      }
    ]
  } catch (error) {
    return [
      { label: "Active Projects", value: "0", icon: Rocket, gradient: "from-purple-500 to-pink-500" },
      { label: "Web3 Builders", value: "0", icon: Users, gradient: "from-blue-500 to-cyan-500" },
      { label: "Total Views", value: "0", icon: Eye, gradient: "from-green-500 to-emerald-500" },
      { label: "Categories", value: "0", icon: Globe, gradient: "from-orange-500 to-red-500" }
    ]
  }
}

export default async function HomePage() {
  const [featuredProjects, categories, stats] = await Promise.all([
    fetchFeaturedProjects(),
    fetchCategories(),
    fetchPlatformStats()
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Figma-style Design */}
      <section className="agency-hero relative overflow-hidden agency-grid-bg">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float delay-300" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-float delay-500" style={{ animationDelay: '4s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center space-y-10 py-32 md:py-40">
            {/* Badge */}
            <div className="animate-fade-in-down">
              <Badge className="agency-badge inline-flex items-center gap-3 px-8 py-4 text-base">
                <Sparkles className="w-5 h-5" />
                <span>Discover Web3 Innovation</span>
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="gradient-heading animate-fade-in-up delay-100">
              Showcase Your
              <br />
              <span className="gradient-purple-blue">Web3 Projects</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto animate-fade-in-up delay-200 leading-relaxed">
              Join the leading platform for Web3 builders to showcase innovative decentralized applications.
              <span className="block mt-2">Connect with thousands of early adopters and grow your community.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-300">
              <Button size="lg" className="agency-btn-primary group text-lg px-10 py-6" asChild>
                <Link href="/projects">
                  <span>Explore Projects</span>
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" className="agency-btn-secondary text-lg px-10 py-6" asChild>
                <Link href="/submit">
                  <Rocket className="mr-3 h-6 w-6" />
                  <span>Submit Your Project</span>
                </Link>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto animate-fade-in-up delay-400">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
                <Input
                  type="text"
                  placeholder="Search for Web3 projects, DeFi protocols, NFTs, DAOs..."
                  className="agency-input pl-16 pr-6 h-16 text-lg"
                />
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-10 text-sm animate-fade-in-up delay-500">
              <div className="flex items-center gap-3 text-muted-foreground group cursor-pointer">
                <Shield className="h-5 w-5 text-green-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold group-hover:text-foreground transition-colors">Verified Projects</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground group cursor-pointer">
                <Zap className="h-5 w-5 text-yellow-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold group-hover:text-foreground transition-colors">Fast Discovery</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground group cursor-pointer">
                <Users className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold group-hover:text-foreground transition-colors">Active Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="agency-section-sm bg-background relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="agency-stat-card animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="agency-stat-value">{stat.value}</div>
                  <div className="agency-stat-label">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="agency-section bg-background">
          <div className="container mx-auto px-4">
            <div className="agency-section-header">
              <Badge className="agency-badge-yellow mb-6">
                <Star className="w-5 h-5 mr-2 fill-current" />
                <span>Featured Projects</span>
              </Badge>
              <h2 className="agency-section-title">
                Trending <span className="gradient-purple-blue">This Week</span>
              </h2>
              <p className="agency-section-subtitle">
                Hand-picked exceptional Web3 projects gaining traction in our community
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {featuredProjects.map((project, index) => (
                <Link 
                  key={project.id} 
                  href={`/projects/${project.owner?.username || 'demo'}/${project.slug}`}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="agency-project-card">
                    <CardContent className="p-0">
                      {/* Thumbnail */}
                      <div className="agency-project-thumbnail">
                        {project.logo_url ? (
                          <img
                            src={project.logo_url}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Rocket className="h-20 w-20 text-muted-foreground/30" />
                          </div>
                        )}
                        {project.is_featured && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-yellow-500/90 text-white border-0 shadow-lg">
                              <Trophy className="w-4 h-4 mr-1" />
                              <span className="font-bold">Featured</span>
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Author */}
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-12 w-12 border-2 border-border shadow-md">
                            <AvatarImage src="" alt={project.owner?.displayName} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                              {project.owner?.displayName?.charAt(0) || 'D'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold">{project.title}</p>
                            <p className="text-sm text-muted-foreground">
                              by {project.owner?.displayName || 'Anonymous'}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          {project.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs font-semibold">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs font-semibold">
                              +{project.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-5 border-t border-border">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Eye className="h-4 w-4" />
                              <span className="font-semibold">{project.views.toLocaleString()}</span>
                            </div>
                            {project.categories && (
                              <Badge className="agency-category-tag text-xs px-3 py-1">
                                {project.categories.name}
                              </Badge>
                            )}
                          </div>
                          <Button size="sm" className="agency-btn-primary h-9 px-5">
                            <Play className="h-4 w-4 mr-1" />
                            <span className="font-bold">View</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-16">
              <Button size="lg" className="agency-btn-secondary px-10 py-6 text-lg" asChild>
                <Link href="/projects">
                  <span className="font-bold">View All Projects</span>
                  <ChevronRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="agency-section bg-muted/20 agency-dots-bg">
        <div className="container mx-auto px-4">
          <div className="agency-section-header">
            <Badge className="agency-badge mb-6">
              <Globe className="w-5 h-5 mr-2" />
              <span>Explore by Category</span>
            </Badge>
            <h2 className="agency-section-title">
              Browse <span className="gradient-purple-blue">Categories</span>
            </h2>
            <p className="agency-section-subtitle">
              Discover innovative projects across different Web3 ecosystems
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[category.slug] || Sparkles
              return (
                <Link 
                  key={category.id} 
                  href={`/categories/${category.slug}`}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Card className="glass-card-hover p-6 text-center h-full group">
                    <CardContent className="p-0">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.gradient || 'from-purple-500 to-pink-500'} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground font-semibold">
                        {category.projects_count} projects
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="agency-section bg-background">
        <div className="container mx-auto px-4">
          <div className="agency-section-header">
            <Badge className="agency-badge mb-6">
              <Zap className="w-5 h-5 mr-2" />
              <span>Platform Features</span>
            </Badge>
            <h2 className="agency-section-title">
              Why Choose <span className="gradient-yellow">Our Platform</span>
            </h2>
            <p className="agency-section-subtitle">
              Everything you need to showcase and grow your Web3 project
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Rocket,
                title: "Get Discovered",
                description: "Reach thousands of Web3 enthusiasts and potential users actively looking for innovative projects",
                gradient: "from-purple-500 via-purple-600 to-pink-500"
              },
              {
                icon: TrendingUp,
                title: "Grow Your Community",
                description: "Build a strong community around your project with engaged early adopters and supporters",
                gradient: "from-blue-500 via-blue-600 to-cyan-500"
              },
              {
                icon: Shield,
                title: "Build Trust",
                description: "Establish credibility with verified profiles and transparent project information",
                gradient: "from-green-500 via-green-600 to-emerald-500"
              },
              {
                icon: BarChart,
                title: "Track Analytics",
                description: "Monitor your project performance with detailed analytics and insights",
                gradient: "from-orange-500 via-orange-600 to-red-500"
              },
              {
                icon: Award,
                title: "Get Featured",
                description: "Top projects get featured on our homepage and social media channels",
                gradient: "from-yellow-500 via-yellow-600 to-amber-500"
              },
              {
                icon: Users,
                title: "Connect with Builders",
                description: "Network with other Web3 builders, investors, and industry leaders",
                gradient: "from-pink-500 via-pink-600 to-rose-500"
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="glass-card-hover p-8 text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="agency-section relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20" />
        <div className="absolute inset-0 agency-grid-bg opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <Badge className="agency-badge-yellow animate-fade-in">
              <Sparkles className="w-5 h-5 mr-2 fill-current" />
              <span>Ready to Launch?</span>
            </Badge>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black animate-fade-in-up delay-100">
              Showcase Your <span className="gradient-purple-blue">Web3 Project</span> Today
            </h2>
            
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
              Join thousands of Web3 builders and get your project in front of the right audience
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-300">
              <Button size="lg" className="agency-btn-primary text-lg px-10 py-6" asChild>
                <Link href="/submit">
                  <Rocket className="mr-3 h-6 w-6" />
                  <span className="font-bold">Submit Your Project</span>
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
              <Button size="lg" className="agency-btn-secondary text-lg px-10 py-6" asChild>
                <Link href="/projects">
                  <Globe className="mr-3 h-6 w-6" />
                  <span className="font-bold">Explore Projects</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
