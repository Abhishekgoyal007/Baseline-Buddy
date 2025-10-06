export function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Result Card Skeleton */}
      <div className="glass-card p-6 space-y-4">
        {/* Title skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 skeleton-box rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 skeleton-box rounded w-3/4"></div>
            <div className="h-4 skeleton-box rounded w-1/2"></div>
          </div>
        </div>
        
        {/* Status badge skeleton */}
        <div className="h-8 skeleton-box rounded-full w-32"></div>
        
        {/* Browser icons skeleton */}
        <div className="flex gap-2">
          <div className="w-10 h-10 skeleton-box rounded"></div>
          <div className="w-10 h-10 skeleton-box rounded"></div>
          <div className="w-10 h-10 skeleton-box rounded"></div>
          <div className="w-10 h-10 skeleton-box rounded"></div>
        </div>
        
        {/* AI Explanation skeleton */}
        <div className="space-y-2">
          <div className="h-4 skeleton-box rounded w-full"></div>
          <div className="h-4 skeleton-box rounded w-full"></div>
          <div className="h-4 skeleton-box rounded w-3/4"></div>
        </div>
        
        {/* Button skeleton */}
        <div className="h-10 skeleton-box rounded w-36"></div>
      </div>
    </div>
  )
}
