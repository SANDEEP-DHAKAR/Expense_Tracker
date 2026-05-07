export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`}
    />
  );
}

export function PanelSkeleton({ rows = 5 }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <Skeleton className="mb-5 h-5 w-40" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
