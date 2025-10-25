export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header Section Skeleton */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="container-custom">
          <div className="max-w-4xl">
            {/* Badge skeleton */}
            <div className="mb-6 h-10 w-48 bg-white/5 rounded-full animate-pulse" />

            {/* Title skeleton */}
            <div className="mb-4 h-16 w-96 bg-white/10 rounded-lg animate-pulse" />

            {/* Description skeleton */}
            <div className="space-y-3 mb-8">
              <div className="h-6 w-full bg-white/5 rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section Skeleton */}
      <section className="py-8 border-t border-b border-white/10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            {/* Search bar skeleton */}
            <div className="w-full md:w-96 h-14 bg-white/5 rounded-xl animate-pulse" />

            {/* Filter buttons skeleton */}
            <div className="flex gap-3">
              <div className="h-12 w-32 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-12 w-24 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid Skeleton */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="bg-[#151515] border border-white/10 rounded-2xl overflow-hidden animate-pulse"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Image skeleton */}
                <div className="h-48 bg-white/5" />

                <div className="p-6">
                  {/* Title skeleton */}
                  <div className="h-6 w-3/4 bg-white/10 rounded mb-3" />

                  {/* Description skeleton */}
                  <div className="space-y-2 mb-4">
                    <div className="h-4 w-full bg-white/5 rounded" />
                    <div className="h-4 w-5/6 bg-white/5 rounded" />
                  </div>

                  {/* Tags skeleton */}
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-white/5 rounded-full" />
                    <div className="h-6 w-20 bg-white/5 rounded-full" />
                    <div className="h-6 w-14 bg-white/5 rounded-full" />
                  </div>

                  {/* Footer skeleton */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="h-4 w-24 bg-white/5 rounded" />
                    <div className="h-4 w-16 bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
