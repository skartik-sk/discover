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
    take: 12, // Get 12 projects for consistent grid
  });
  return projects;
}

export default async function HomePage() {
  const projects = await getProjects();
  
  return (
    <div className="min-h-screen p-2 sm:p-3 md:p-4 bg-transparent">
      <div className="w-full min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2rem)] bg-main-bg border border-frame-border rounded-soft">
        <main className="flex w-full grow flex-col px-6 py-8 md:px-8 md:py-16">
          <div className="flex flex-col items-center justify-center gap-6 text-center py-12 md:py-20">
            <h1 className="text-header-text text-4xl font-bold leading-tight tracking-tight md:text-6xl">Discover Tomorrow&apos;s Web3</h1>
            <h2 className="max-w-2xl text-body-text text-base font-normal leading-relaxed md:text-lg">The daily destination for the best new Web3 products. Curated, reviewed, and ranked by the community.</h2>
            <div className="mt-6 w-full max-w-lg">
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
          
          {/* Uniform Grid - All cards same height */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}