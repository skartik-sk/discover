import { prisma } from '@/lib/prisma';
import { LeaderboardClient } from '@/components/LeaderboardClient';

export const dynamic = 'force-dynamic';

async function getTopProjects() {
  const projects = await prisma.project.findMany({
    where: { status: 'approved' },
    orderBy: { upvotes: 'desc' },
    take: 10,
    include: {
      user: {
        select: {
          username: true,
        },
      },
      _count: {
        select: { likes: true }
      }
    }
  });
  return projects;
}

export default async function LeaderboardPage() {
  const projects = await getTopProjects();

  return (
    <main className="flex w-full grow flex-col px-6 py-8 md:px-8 md:py-16">
      <LeaderboardClient projects={projects} />
    </main>
  );
}
