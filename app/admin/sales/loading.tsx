import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Skeleton className="h-9 w-24 bg-white/10" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 bg-white/10" />
            <Skeleton className="h-6 w-48 bg-white/10" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 bg-white/10" />
          <Skeleton className="h-10 w-[300px] bg-white/10" />
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white/5 border-white/20 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24 bg-white/10" />
                <Skeleton className="h-4 w-4 bg-white/10" />
              </div>
              <Skeleton className="h-8 w-24 bg-white/10" />
              <Skeleton className="h-3 w-20 bg-white/10" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-white/5 border-white/20 rounded-xl p-6 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40 bg-white/10" />
                <Skeleton className="h-4 w-60 bg-white/10" />
              </div>
              <Skeleton className="h-[350px] w-full bg-white/10" />
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white/5 border-white/20 rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40 bg-white/10" />
            <Skeleton className="h-4 w-60 bg-white/10" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3">
              <Skeleton className="h-4 w-full bg-white/10" />
            </div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <Skeleton className="h-6 w-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
