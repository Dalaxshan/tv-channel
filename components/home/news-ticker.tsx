import { news } from "@/lib/data";

export function NewsTicker() {
  const items = news.filter((n) => n.breaking).concat(news).slice(0, 6);
  const loop = [...items, ...items];

  return (
    <div className="flex items-center border-y border-white/10 bg-primary/10">
      <span className="shrink-0 bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white">
        Breaking
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap py-2.5 pl-6">
          {loop.map((item, i) => (
            <span key={`${item.slug}-${i}`} className="text-xs text-text-muted">
              {item.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
