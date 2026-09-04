export function HeroSkeleton() {
  return (
    <div className="relative z-10 flex h-full items-end">
      <div className="container-page w-full pb-20 lg:pb-28">
        <div className="max-w-2xl space-y-4">
          <div className="h-5 w-24 animate-pulse rounded-full bg-white/10" />
          <div className="space-y-3">
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-white/10" />
            <div className="h-10 w-1/2 animate-pulse rounded-lg bg-white/10" />
          </div>
          <div className="h-4 w-2/5 animate-pulse rounded bg-white/10" />
          <div className="mt-8 flex gap-3">
            <div className="h-11 w-36 animate-pulse rounded-full bg-white/10" />
            <div className="h-11 w-36 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
        <div className="mt-10 flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 w-3 animate-pulse rounded-full bg-white/10"
              />
            ))}
          </div>
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}
