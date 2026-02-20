'use client';

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 4 }: LoadingSkeletonProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-44 rounded-2xl bg-white border border-gray-100 animate-pulse"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-12 w-12 bg-gray-100 rounded-xl" />
            </div>
            <div className="h-8 w-20 bg-gray-100 rounded" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}