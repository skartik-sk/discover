'use client'

export default function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom section-padding">
        {/* Back Navigation Skeleton */}
        <div className="h-6 w-24 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>

        {/* Project Header Skeleton */}
        <div className="showcase-card-hover p-6 lg:p-8 mb-8 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Project Logo Skeleton */}
            <div className="lg:col-span-2 flex justify-center lg:justify-start mb-6 lg:mb-0">
              <div className="w-20 h-20 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>

            {/* Main Project Info Skeleton */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
                <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-10 w-3/4 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
              <div className="h-6 w-full bg-gray-200 rounded-lg mb-6 animate-pulse"></div>

              {/* Tags Skeleton */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start">
                <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="showcase-stat-card p-4 animate-pulse">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Project Info Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="showcase-card-hover p-6 animate-pulse">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-lg mb-2 mx-auto"></div>
                <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Reviews Section Skeleton */}
        <div className="showcase-card-hover p-8 animate-pulse">
          <div className="text-center mb-6">
            <div className="h-8 w-24 bg-gray-200 rounded-lg mx-auto mb-2"></div>
            <div className="h-5 w-16 bg-gray-200 rounded-lg mx-auto"></div>
          </div>

          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="border-b border-gray-200 pb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((j) => (
                          <div key={j} className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Project Owner Card Skeleton */}
            <div className="showcase-card-hover p-6 animate-pulse">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-lg mx-auto mb-1"></div>
                <div className="h-4 w-20 bg-gray-200 rounded mx-auto mb-4"></div>
                <div className="h-10 w-32 bg-gray-200 rounded-lg mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}