"use client";

export function TaskSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-strong rounded-2xl p-5 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-start gap-4">
            {/* Checkbox skeleton */}
            <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700 skeleton" />

            {/* Content skeleton */}
            <div className="flex-1 space-y-3">
              {/* Title */}
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 skeleton" />

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-full skeleton" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3 skeleton" />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 pt-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 skeleton" />
              </div>
            </div>

            {/* Actions skeleton */}
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700 skeleton" />
              <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700 skeleton" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProgressSkeleton() {
  return (
    <div className="glass-strong rounded-2xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-700 skeleton" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded skeleton" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded skeleton" />
          </div>
        </div>
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded skeleton" />
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full skeleton" />
    </div>
  );
}
