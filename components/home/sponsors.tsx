import { sponsors } from "@/lib/data";
import Image from "next/image";

export function Sponsors() {
  const loop = [...sponsors, ...sponsors];
  return (
    <section className="border-y border-white/5 bg-surface/30 py-10">
      <p className="container-page mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
        Our Partners
      </p>
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-16">
          {loop.map((s, i) => (
            <span key={`${s}-${i}`} className="flex items-center justify-center rounded-xl bg-white px-5 py-3">
              <Image src={`/${s}`} alt="sponsor" width={150} height={60} className="h-15 w-auto object-contain" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
