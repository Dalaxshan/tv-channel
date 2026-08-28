import Image from "next/image";
import Link from "next/link";
import { presenters } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";

export function FeaturedHosts() {
  return (
    <section className="container-page py-6 lg:py-4">
      <SectionHeading
        eyebrow="The Faces of Pulse"
        title="Featured Hosts"
        description="Meet the presenters bringing you the day's biggest stories and shows."
        action={{ label: "All presenters", href: "/presenters" }}
      />
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {presenters.map((p) => (
          <Link key={p.slug} href={`/presenters/${p.slug}`} className="group text-center">
            <div className="relative mx-auto aspect-3/4 w-full max-w-55 overflow-hidden rounded-2xl">
              <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="220px" />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <h4 className="mt-3 font-display text-sm font-semibold">{p.name}</h4>
            <p className="text-xs text-text-muted">{p.role}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
