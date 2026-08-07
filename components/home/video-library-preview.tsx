import Image from "next/image";
import Link from "next/link";
import { Play, Eye } from "lucide-react";
import { episodes } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";

export function VideoLibraryPreview() {
  const items = [...episodes].slice(0, 5);
  return (
    <section className="container-page py-16 lg:py-24">
      <SectionHeading
        eyebrow="On Demand"
        title="Video Library"
        description="Search, filter and sort thousands of hours of TV Channel content."
        action={{ label: "Browse library", href: "/videos" }}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((ep) => (
          <Link key={ep.slug} href={`/videos/${ep.slug}`} className="group relative overflow-hidden rounded-xl">
            <div className="relative aspect-3/4">
              <Image src={ep.image} alt={ep.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width:768px) 40vw, 200px" />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/10 to-transparent" />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <h4 className="text-xs font-semibold leading-snug line-clamp-2">{ep.title}</h4>
              <p className="mt-1 flex items-center gap-1 text-[10px] text-text-muted">
                <Eye className="h-3 w-3" /> {(Math.random() * 90 + 10).toFixed(0)}K views
              </p>
            </div>
            <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Play className="h-3.5 w-3.5" fill="white" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
