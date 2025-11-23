import { ProjectsWithFilters } from '@/components/ProjectsWithFilters';
import { prisma } from '@/lib/prisma';

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
  });
  return projects;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsWithFilters initialProjects={projects} />;
}
