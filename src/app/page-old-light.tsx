import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  ArrowRight,
  Sparkles,
  Rocket,
  Users,
  Eye,
  Globe,
  Trophy,
  Zap,
  Shield,
  CheckCircle,
  Code,
  Palette,
  Search,
  Star
} from 'lucide-react'

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
      { label: "Projects Showcased", value: projectsCount, icon: Rocket },
      { label: "Active Creators", value: usersCount, icon: Users },
      { label: "Total Views", value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}K` : totalViews.toString(), icon: Eye },
      { label: "Categories", value: categoriesCount, icon: Globe }
    ]
  } catch (error) {
    console.error('Error in getStats:', error)
    return [
      { label: "Projects Showcased", value: 0, icon: Rocket },
      { label: "Active Creators", value: 0, icon: Users },
      { label: "Total Views", value: "0", icon: Eye },
      { label: "Categories", value: 0, icon: Globe }
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-dark">
        <div className="hero-content">
          {/* Floating badge */}
          <div className="animate-fade-in-up mb-8">
            <span className="badge-primary inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Discover Web3 Innovations
            </span>
          </div>

          {/* Hero Title */}
          <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            DISCOVER YOUR
            <br />
            WEB3 PROJECTS
          </h1>

          {/* Hero Description */}
          <p className="hero-description animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Join thousands of Web3 builders discovering innovative decentralized projects.
            <br className="hidden md:block" />
            Get discovered, attract users, and grow your Web3 ecosystem.
          </p>

          {/* Hero Actions */}
          <div className="hero-actions animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link href="/projects" className="btn-primary btn-lg">
              Explore Projects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/submit" className="btn-secondary btn-lg">
              Submit Your Work
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mt-12 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#818181] h-5 w-5" />
            <input
              type="text"
              placeholder="Search Web3 projects, protocols, or categories..."
              className="input-dark pl-14 text-base w-full"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-[#1B1B1B]">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="card-dark p-8 text-center animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-[#FFDF00]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-[#FFDF00]" />
                </div>
                <div className="text-4xl font-black text-[#FFDF00] mb-2">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}+
                </div>
                <div className="text-sm text-[#818181] uppercase font-bold tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <div className="section-badge">
              <Globe className="w-5 h-5" />
              <span>Explore</span>
            </div>
            <h2 className="section-title">BROWSE CATEGORIES</h2>
            <p className="section-description">
              Explore innovative Web3 projects across different blockchain categories
            </p>
          </div>

          <div className="grid-services">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Link 
                  key={index} 
                  href={`/categories/${category.slug}`}
                  className="card-service group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="card-service-icon">
                    <IconComponent className="h-8 w-8 text-[#FFDF00]" />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-3 text-white group-hover:text-[#FFDF00] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[#818181] leading-relaxed">
                    {category.projects_count || 0} innovative projects
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="section-padding bg-[#1B1B1B]">
          <div className="container-custom">
            <div className="section-header">
              <div className="section-badge">
                <Trophy className="w-5 h-5" />
                <span>Featured</span>
              </div>
              <h2 className="section-title">TRENDING THIS WEEK</h2>
              <p className="section-description">
                Hand-picked exceptional projects that are gaining traction in our community
              </p>
            </div>

            <div className="grid-projects">
              {featuredProjects.map((project, index) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.owner?.username || 'demo'}/${project.slug}`}
                  className="card-project group animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Project Image */}
                  <div className="card-project-image overflow-hidden">
                    {project.logo_url ? (
                      <img 
                        src={project.logo_url} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FFDF00]/20 to-[#FFDF00]/5 flex items-center justify-center">
                        <span className="text-6xl font-black text-[#FFDF00]/30">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="card-project-content">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="card-project-title flex-1">
                        {project.title}
                      </h3>
                      {project.is_featured && (
                        <Trophy className="h-5 w-5 text-[#FFDF00] flex-shrink-0 ml-2" />
                      )}
                    </div>
                    
                    <p className="card-project-meta mb-4">
                      {project.categories?.name || 'Web3'}
                    </p>

                    <p className="text-[#818181] text-sm leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} className="badge-tag">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="badge-tag">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#222222]">
                      <div className="flex items-center gap-4 text-sm text-[#818181]">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{project.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="text-xs truncate max-w-[100px]">
                            {project.owner?.displayName || project.owner?.username || 'Anonymous'}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#FFDF00] opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link href="/projects" className="btn-outline btn-lg">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features/Why Choose Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="section-header">
            <div className="section-badge">
              <Sparkles className="w-5 h-5" />
              <span>Benefits</span>
            </div>
            <h2 className="section-title">WHY CHOOSE OUR PLATFORM?</h2>
            <p className="section-description">
              The ultimate platform for Web3 creators to showcase their innovative projects
            </p>
          </div>

          <div className="grid-services">
            <div className="card-service group animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              <div className="card-service-icon">
                <Zap className="h-8 w-8 text-[#FFDF00]" />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 text-white group-hover:text-[#FFDF00] transition-colors">
                Get Discovered
              </h3>
              <p className="text-[#818181] leading-relaxed">
                Reach thousands of potential users and collaborators looking for innovative Web3 projects like yours
              </p>
            </div>

            <div className="card-service group animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="card-service-icon">
                <CheckCircle className="h-8 w-8 text-[#FFDF00]" />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 text-white group-hover:text-[#FFDF00] transition-colors">
                Quality Projects
              </h3>
              <p className="text-[#818181] leading-relaxed">
                Join a curated community of high-quality Web3 projects and innovative decentralized applications
              </p>
            </div>

            <div className="card-service group animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="card-service-icon">
                <Shield className="h-8 w-8 text-[#FFDF00]" />
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 text-white group-hover:text-[#FFDF00] transition-colors">
                Build Your Brand
              </h3>
              <p className="text-[#818181] leading-relaxed">
                Create a stunning portfolio that showcases your unique Web3 projects and technical expertise
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-[#FFDF00]/10 to-[#FFDF00]/5">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-up mb-8">
              <span className="badge-primary inline-flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Get Started Today
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black uppercase mb-6 text-white animate-fade-in-up" style={{ animationDelay: '100ms', lineHeight: '0.9' }}>
              READY TO SHOWCASE
              <br />
              <span className="text-[#FFDF00]">YOUR WEB3 PROJECTS?</span>
            </h2>
            
            <p className="text-xl text-[#818181] mb-10 leading-relaxed animate-fade-in-up max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
              Join thousands of Web3 creators building their portfolios and growing their communities
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <Link href="/submit" className="btn-primary btn-lg">
                Submit Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/projects" className="btn-outline btn-lg">
                Explore Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
