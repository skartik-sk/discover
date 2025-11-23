import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';
import QuizButton from '@/components/QuizButton';

export const dynamic = 'force-dynamic';

async function getProject(username: string, slug: string) {
  const project = await prisma.project.findFirst({
    where: { 
      slug,
      user: {
        username,
      },
    },
    include: {
      user: {
        select: {
          username: true,
          name: true,
          image: true,
          bio: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: {
          likes: true,
          reviews: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  // Increment view count
  await prisma.project.update({
    where: { id: project.id },
    data: { viewCount: { increment: 1 } },
  });

  return project;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const project = await getProject(username, slug);

  if (!project) {
    notFound();
  }

  const tags = project.tags.split(',').filter(Boolean);
  const blockchains = project.blockchains.split(',').filter(Boolean);

  return (
    <main className="w-full max-w-7xl mx-auto p-6 sm:p-10 lg:p-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column (70%) */}
          <div className="w-full lg:w-[calc(70%-1.5rem)] flex flex-col gap-8">
            {/* MediaPlayer */}
            <VideoPlayer 
              videoUrl={project.videoUrl}
              coverUrl={project.coverUrl}
              projectName={project.name}
            />

            {/* Project Info Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={project.logoUrl} 
                  alt={project.name} 
                  className="h-16 w-16 rounded-full border-2 border-gray-200"
                />
                <div>
                  <p className="text-charcoal-grey text-4xl font-black leading-tight tracking-[-0.033em]">
                    {project.name}
                  </p>
                  <p className="text-dark-grey text-sm">
                    by <Link href={`/${project.user.username}`} className="font-semibold hover:text-forest-green">@{project.user.username}</Link>
                  </p>
                </div>
              </div>
              <p className="text-dark-grey text-lg font-normal leading-normal">
                {project.tagline}
              </p>
              
              {/* Chips */}
              <div className="flex gap-3 flex-wrap">
                <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-terracotta/20 px-4 text-terracotta">
                  <p className="text-sm font-medium leading-normal">{project.category}</p>
                </div>
                {tags.slice(0, 3).map((tag, i) => (
                  <div key={i} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-mustard/20 px-4 text-mustard">
                    <p className="text-sm font-medium leading-normal">{tag.trim()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini-Bento Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white shadow-sm">
                <p className="text-dark-grey text-base font-medium leading-normal">Upvotes</p>
                <p className="text-charcoal-grey tracking-light text-2xl font-bold leading-tight">{project.upvotes.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white shadow-sm">
                <p className="text-dark-grey text-base font-medium leading-normal">Views</p>
                <p className="text-charcoal-grey tracking-light text-2xl font-bold leading-tight">{project.viewCount.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white shadow-sm">
                <p className="text-dark-grey text-base font-medium leading-normal">Reviews</p>
                <p className="text-charcoal-grey tracking-light text-2xl font-bold leading-tight">{project._count.reviews}</p>
              </div>
            </div>

            {/* Detailed Description Section */}
            <div className="flex flex-col gap-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col gap-3">
                <h3 className="text-charcoal-grey text-2xl font-bold">What is {project.name}?</h3>
                <p className="text-dark-grey leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>

              {blockchains.length > 0 && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-charcoal-grey text-xl font-bold">Blockchains</h3>
                  <div className="flex gap-2 flex-wrap">
                    {blockchains.map((chain, i) => (
                      <div key={i} className="flex h-8 items-center justify-center rounded-full bg-azure-blue/20 px-4 text-azure-blue text-sm font-semibold">
                        {chain.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              {project.reviews.length > 0 && (
                <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
                  <h3 className="text-charcoal-grey text-2xl font-bold">Community Reviews</h3>
                  <div className="space-y-4">
                    {project.reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-xl p-4 bg-white">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                          <div>
                            <p className="font-semibold text-sm">{review.user.name}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`material-symbols-outlined text-sm ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                  star
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-dark-grey text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (30%) - Action Dock */}
          <div className="w-full lg:w-[calc(30%-1.5rem)]">
            <div className="sticky top-28">
              <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                <div className="flex flex-col gap-4">
                  <Link 
                    href={project.websiteUrl}
                    target="_blank"
                    className="w-full flex items-center justify-center rounded-lg h-12 px-6 bg-forest-green text-white text-base font-bold hover:opacity-90 transition-opacity"
                  >
                    Visit Website
                  </Link>
                  <QuizButton projectName={project.name} />
                </div>

                <hr className="border-gray-200"/>

                <div className="flex flex-col gap-4">
                  <h4 className="text-charcoal-grey font-bold">Trust Metrics</h4>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-600 text-2xl">verified</span>
                    <p className="text-dark-grey font-medium text-sm">Verified Team</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-azure-blue text-2xl">shield</span>
                    <p className="text-dark-grey font-medium text-sm">Community Trusted</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-mustard text-2xl">verified_user</span>
                    <p className="text-dark-grey font-medium text-sm">{project._count.likes} Upvotes</p>
                  </div>
                </div>

                {/* Social Links */}
                {(project.twitter || project.discord || project.github) && (
                  <>
                    <hr className="border-gray-200"/>
                    <div className="flex flex-col gap-3">
                      <h4 className="text-charcoal-grey font-bold text-sm">Connect</h4>
                      <div className="flex gap-3">
                        {project.twitter && (
                          <Link href={`https://twitter.com/${project.twitter.replace('@', '')}`} target="_blank" className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                            <span className="material-symbols-outlined text-lg">tag</span>
                          </Link>
                        )}
                        {project.discord && (
                          <Link href={project.discord} target="_blank" className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                            <span className="material-symbols-outlined text-lg">forum</span>
                          </Link>
                        )}
                        {project.github && (
                          <Link href={`https://github.com/${project.github}`} target="_blank" className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                            <span className="material-symbols-outlined text-lg">code</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
