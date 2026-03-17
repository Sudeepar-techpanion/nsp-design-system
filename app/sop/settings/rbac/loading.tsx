import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Header Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-8 w-80 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Main Layout Skeleton */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg border border-border p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-10 w-full mb-4" />
              <div className="mt-6">
                <Skeleton className="h-5 w-40 mb-3" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel */}
          <div className="col-span-6">
            <div className="bg-white rounded-lg border border-border p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border border-border rounded-lg p-4">
                    <Skeleton className="h-5 w-40 mb-3" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-9 w-32" />
                      <Skeleton className="h-9 w-28" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg border border-border p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
