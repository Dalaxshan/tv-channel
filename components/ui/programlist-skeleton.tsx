export function ProgramListSkeleton() {
  return (
    <div aria-label="Loading programs" aria-busy="true">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-full max-w-sm animate-pulse rounded-full bg-white/10" />
        <div className="h-10 w-full animate-pulse rounded-full bg-white/10 sm:w-36" />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="h-7 w-20 animate-pulse rounded-full bg-white/10" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="aspect-16/10 animate-pulse bg-white/10" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}