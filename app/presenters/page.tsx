import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { presenters } from "@/lib/data";

export const metadata: Metadata = {
  title: "Presenters",
  description: "Meet the anchors, hosts and correspondents behind TV Channel's news and entertainment programming.",
  alternates: { canonical: "/presenters" },
};

export default function PresentersPage() {
  return (
    <div className="container-page pb-24 pt-32 lg:pt-40">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">The Team</span>
        <h1 className="mt-2 font-display text-4xl font-bold">Presenters</h1>
        <p className="mt-3 text-text-muted">The voices and faces bringing TV Channel to life, every day.</p>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {presenters.map((p) => (
          <Link key={p.slug} href={`/presenters/${p.slug}`} className="group text-center">
            <div className="relative mx-auto aspect-3/4 w-full overflow-hidden rounded-2xl">
              <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="260px" />
            </div>
            <h3 className="mt-3 font-display text-sm font-semibold">{p.name}</h3>
            <p className="text-xs text-text-muted">{p.role}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
