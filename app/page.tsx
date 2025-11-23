import { prisma } from '@/lib/prisma';
import { ProjectCard } from '@/components/ProjectCard';

export const dynamic = 'force-dynamic';

async function getProjects() {
  const projects = await prisma.project.findMany({
    where: { status: 'approved' },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: [
      { featured: 'desc' },
      { upvotes: 'desc' },
    ],
    take: 6, // Get top 6 projects for homepage
  });
  return projects;
}

export default async function HomePage() {
  const projects = await getProjects();
  const [featuredProject, ...regularProjects] = projects;
  
  return (
    <div className="min-h-screen p-2 sm:p-3 md:p-4 bg-transparent">
      <div className="w-full min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2rem)] bg-main-bg border border-frame-border rounded-soft">
        <main className="flex w-full grow flex-col px-6 py-8 md:px-8 md:py-12">
          <div className="relative flex flex-col items-center justify-center gap-6 text-center py-16 md:py-24 px-8 md:px-12 mb-8 rounded-soft overflow-hidden border border-primary-green/20 shadow-sm">
            {/* Strong greenish gradient base */}
            <div className="absolute inset-0 bg-linear-to-br from-primary-green/15 via-primary-green/8 to-primary-green/12"></div>
            
            {/* Matte grain texture */}
            <div className="absolute inset-0 opacity-60 mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"200\" height=\"200\" viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.08\"/%3E%3C/svg%3E\")', backgroundSize: '180px 180px'}}></div>
            
            {/* Micro dot pattern for texture */}
            <div className="absolute inset-0 opacity-25" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"2\" cy=\"2\" r=\"1\" fill=\"%233A5A40\" fill-opacity=\"0.12\"/%3E%3C/svg%3E\")', backgroundSize: '24px 24px'}}></div>
            
            {/* Soft matte finish overlay */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.2px]"></div>
            
            {/* Radial glow for depth */}
            <div className="absolute inset-0 opacity-50" style={{background: 'radial-gradient(ellipse 700px 500px at 50% 40%, rgba(58, 90, 64, 0.12) 0%, transparent 60%)'}}></div>
            
            <h1 className="relative text-primary text-4xl font-bold leading-tight tracking-tight md:text-6xl drop-shadow-sm">Discover Tomorrow&apos;s Web3</h1>
            <h2 className="relative max-w-2xl text-body-text text-base font-normal leading-relaxed md:text-lg">The daily destination for the best new Web3 products. Curated, reviewed, and ranked by the community.</h2>
            <div className="relative mt-6 w-full max-w-lg">
              <form action="/projects" method="GET" className="group relative flex w-full items-stretch">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-body-text/60">
                  <span className="material-symbols-outlined text-xl!">search</span>
                </div>
                <input 
                  name="q"
                  className="form-input flex w-full min-w-0 flex-1 rounded-btn border border-gray-200 bg-white/80 py-3 pl-11 pr-32 text-base text-header-text shadow-search transition-all placeholder:text-body-text/60 focus:border-primary-green/50 focus:ring-2 focus:ring-primary-green/20" 
                  placeholder="Search for projects, tags, or DAOs..." 
                  type="search" 
                />
                <button type="submit" className="absolute inset-y-1.5 right-1.5 flex cursor-pointer items-center justify-center rounded-lg h-auto px-5 bg-primary-green text-white text-sm font-semibold transition-transform duration-200 ease-in-out hover:scale-105">Search</button>
              </form>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Featured Project - Large */}
            {featuredProject && (
              <div className="group relative flex flex-col md:col-span-2 md:row-span-2 overflow-hidden rounded-soft bg-card-bg shadow-card transition-all duration-300 hover:shadow-card-hover transform hover:-translate-y-1 min-h-[400px]">
                <div className="absolute inset-0 bg-cover bg-center opacity-80 transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: `url("${featuredProject.coverUrl}")`, filter: 'saturate(0.8) contrast(0.9)'}}></div>
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="relative h-full flex flex-col justify-end p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div className="flex flex-col gap-3 flex-1">
                      <div className="flex items-center gap-3">
                        <img 
                          alt={`${featuredProject.name} Logo`}
                          className="h-12 w-12 rounded-full border-2 border-white/50 bg-gray-700 shadow-lg" 
                          src={featuredProject.logoUrl}
                        />
                        <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{featuredProject.name}</h3>
                      </div>
                      <p className="max-w-md text-sm md:text-base text-gray-100">{featuredProject.tagline}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <div className="flex h-7 shrink-0 items-center justify-center rounded-tag bg-accent-blue/30 backdrop-blur-sm px-3 border border-accent-blue/20">
                          <p className="text-white text-xs font-semibold">{featuredProject.category}</p>
                        </div>
                        {featuredProject.tags?.split(',').slice(0, 2).map((tag: string, i: number) => (
                          <div key={i} className="flex h-7 shrink-0 items-center justify-center rounded-tag bg-accent-yellow/30 backdrop-blur-sm px-3 border border-accent-yellow/20">
                            <p className="text-white text-xs font-semibold">{tag.trim()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-btn border border-white/30 bg-white/15 px-4 py-2 text-white backdrop-blur-md transition-all hover:bg-white/25 shadow-lg">
                      <span className="material-symbols-outlined text-2xl!">arrow_drop_up</span>
                      <span className="text-base font-bold tracking-tight">{featuredProject.upvotes}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Regular Projects - Only show 5 */}
            {regularProjects.slice(0, 5).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}