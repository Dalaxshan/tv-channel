import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { podcasts } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";

export function Podcasts() {
  return (
    <section className="bg-surface/40 py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Conversations"
          title="Podcasts & Interviews"
          description="Video podcasts, celebrity interviews and behind-the-scenes discussions."
          action={{ label: "All episodes", href: "/videos?type=podcast" }}
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {podcasts.map((p) => (
            <Link key={p.slug} href={`/videos/${p.slug}`} className="group overflow-hidden rounded-2xl bg-surface">
              <div className="relative aspect-video">
                <Image src={p.image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:768px) 90vw, 380px" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <Play className="h-4 w-4 translate-x-0.5" fill="white" />
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-display text-base font-semibold">{p.title}</h4>
                <p className="mt-1 text-sm text-text-muted">{p.guest}</p>
                <p className="mt-2 text-xs text-text-muted">{formatDate(p.date)} · {p.duration}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
