import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { presenters, shows } from "@/lib/data";
import { ProgramCard } from "@/components/home/program-card";

export function generateStaticParams() {
  return presenters.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const presenter = presenters.find((p) => p.slug === slug);
  if (!presenter) return {};
  return {
    title: presenter.name,
    description: presenter.bio,
    alternates: { canonical: `/presenters/${presenter.slug}` },
    openGraph: { images: [{ url: presenter.image }] },
  };
}

export default async function PresenterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const presenter = presenters.find((p) => p.slug === slug);
  if (!presenter) notFound();

  const presenterShows = shows.filter((s) => presenter.shows.includes(s.title));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: presenter.name,
    jobTitle: presenter.role,
    image: presenter.image,
  };

  return (
    <div className="pb-24 pt-32 lg:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-page grid gap-10 lg:grid-cols-[320px_1fr]">
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl">
          <Image src={presenter.image} alt={presenter.name} fill className="object-cover" priority />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{presenter.name}</h1>
          <p className="mt-1 text-accent">{presenter.role}</p>
          <p className="mt-4 max-w-2xl text-text-muted">{presenter.bio}</p>
          <div className="mt-6 flex gap-3">
            {presenter.social.map((s) => (
              <a key={s.platform} href={s.url} className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium hover:border-white/30">
                {s.platform}
              </a>
            ))}
          </div>

          {presenterShows.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-xl font-semibold">Shows</h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {presenterShows.map((s) => (
                  <ProgramCard key={s.slug} show={s} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
