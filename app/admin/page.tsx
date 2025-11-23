import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import AdminActions from '@/components/AdminActions';

export const dynamic = 'force-dynamic';

async function getPendingProjects() {
  const projects = await prisma.project.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
    },
  });
  return projects;
}

function getTimeAgo(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return 'Just now';
}

export default async function AdminPage() {
  const pendingProjects = await getPendingProjects();
  return (
    <div className="flex h-screen w-full">
      <aside className="flex w-64 flex-col border-r border-border-color bg-sidebar-bg p-4">
        <div className="flex items-center gap-2 px-2 py-4 text-header-text">
          <div className="size-7 text-primary-green">
            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L1 8v8l11 6 11-6V8l-11-6zm0 2.311L19.531 8 12 11.689 4.469 8 12 4.311zM3 9.611L12 14.311l9-4.7V16L12 20.689 3 16V9.611z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Discover</h2>
          <span className="ml-1 rounded-md bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">Admin</span>
        </div>
        <nav className="mt-8 flex flex-col gap-2">
          <a className="flex items-center gap-3 rounded-btn bg-sidebar-active-bg px-3 py-2.5 text-sm font-semibold text-sidebar-active-text" href="#">
            <span className="material-symbols-outlined text-xl!">inbox</span>
            <span>Pending Review</span>
            <span className="ml-auto rounded-full bg-primary-green px-2 py-0.5 text-xs text-white">{pendingProjects.length}</span>
          </a>
          <a className="flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium text-body-text hover:bg-gray-100" href="#">
            <span className="material-symbols-outlined !text-xl">task_alt</span>
            <span>Approved</span>
          </a>
          <a className="flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium text-body-text hover:bg-gray-100" href="#">
            <span className="material-symbols-outlined !text-xl">cancel</span>
            <span>Rejected</span>
          </a>
          <a className="flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium text-body-text hover:bg-gray-100" href="#">
            <span className="material-symbols-outlined !text-xl">flag</span>
            <span>Flagged</span>
          </a>
        </nav>
        <div className="mt-auto flex flex-col gap-4">
          <div className="h-px w-full bg-border-color"></div>
          <div className="flex items-center gap-3 px-2">
            <img alt="Admin Avatar" className="h-9 w-9 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOyflq0lOLqIHIj6DrKczMsyuyYIUM0Uk0XQY-RhLq83I2_wvndiUuwt6lV2KU2ZnT2RW1y9l7onf_HQ-GclqbPDp2oZ21YDK9aOcOzsBcqK-xLYgYCnSwq5iald_r55NHTu0sRYj-SQnWB0lEIPG-aGCJORcReK2XuVO47pBF3p0BLhce3AnT9pcR8V_PckCcpfIrQs73svF5r8oRs4pv_aKetgxjE7kFzcleSvsDZTXugeN7DZAJD9q9N0dD7l7mX8jrTgzcZZJy"/>
            <div>
              <p className="text-sm font-semibold text-header-text">Alex Chen</p>
              <p className="text-xs text-body-text">Curation Lead</p>
            </div>
            <button className="ml-auto text-body-text hover:text-header-text">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </aside>
      <main className="w-full flex-1 overflow-y-auto p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-header-text">Pending Review Queue</h1>
            <p className="mt-1 text-body-text">Review and moderate new project submissions.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-soft border border-border-color bg-white p-4">
              <h3 className="text-sm font-medium text-body-text">Submission Volume</h3>
              <p className="mt-1 text-2xl font-bold text-header-text">78 <span className="text-sm font-medium text-body-text">/ last 24h</span></p>
            </div>
            <div className="rounded-soft border border-border-color bg-white p-4">
              <h3 className="text-sm font-medium text-body-text">Avg. Review Time</h3>
              <p className="mt-1 text-2xl font-bold text-header-text">3.2 <span className="text-sm font-medium text-body-text">hours</span></p>
            </div>
          </div>
        </header>
        <div className="mt-8 overflow-hidden rounded-soft border border-border-color bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-color text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-body-text" scope="col">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-body-text" scope="col">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-body-text" scope="col">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-body-text" scope="col">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-body-text" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color bg-white">
                {pendingProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-body-text">
                      No pending projects to review.
                    </td>
                  </tr>
                ) : (
                  pendingProjects.map((project) => (
                    <tr key={project.id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img alt={`${project.name} Logo`} className="h-10 w-10 shrink-0 rounded-full bg-gray-700 object-cover" src={project.logoUrl} />
                          <div>
                            <Link href={`/project/${project.slug}`} className="font-semibold text-header-text hover:underline">{project.name}</Link>
                            <div className="text-body-text">{project.websiteUrl}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-body-text">{getTimeAgo(project.createdAt)}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex h-6 w-fit items-center justify-center rounded-tag bg-accent-blue/10 px-2.5">
                          <p className="text-xs font-medium text-accent-blue">{project.category}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex h-6 w-fit items-center justify-center rounded-tag bg-tag-kyc-bg px-2.5">
                            <p className="text-xs font-medium text-tag-kyc-text">Pending Review</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <AdminActions projectId={project.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
