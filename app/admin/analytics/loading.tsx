import { Skeleton } from "@/components/ui/skeleton"
import { Mountain } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Skeleton className="h-9 w-24 bg-white/10" />
          <div className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-white" />
            <Skeleton className="h-6 w-48 bg-white/10" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-[300px] bg-white/10 mb-4" />
          
          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[120px] w-full bg-white/5 rounded-lg" />
            ))}
          </div>
          
          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Skeleton className="h-[350px] w-full bg-white/5 rounded-lg" />
            <Skeleton className="h-[350px] w-full bg-white/5 rounded-lg" />
          </div>
          
          {/* Tables Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-[320px] w-full bg-white/5 rounded-lg" />
            <Skeleton className="h-[320px] w-full bg-white/5 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
