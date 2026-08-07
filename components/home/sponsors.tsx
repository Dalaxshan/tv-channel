import { sponsors } from "@/lib/data";

export function Sponsors() {
  const loop = [...sponsors, ...sponsors];
  return (
    <section className="border-y border-white/5 bg-surface/30 py-10">
      <p className="container-page mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
        Sponsors &amp; Partners
      </p>
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-16">
          {loop.map((s, i) => (
            <span key={`${s}-${i}`} className="whitespace-nowrap font-display text-lg font-semibold text-text-muted/60">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
