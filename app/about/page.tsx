import type { Metadata } from "next";
import Image from "next/image";
import { Award, Target, Eye, Users, MapPin, Briefcase } from "lucide-react";
import { stats } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "TV Channel's history, mission, vision, management team, awards and national coverage.",
  alternates: { canonical: "/about" },
};

const milestones = [
  { year: "2004", text: "TV Channel launches with a single studio and a promise: honest news, every night." },
  { year: "2011", text: "Nationwide broadcast coverage reaches every province." },
  { year: "2018", text: "Launch of TV Channel's first original drama slate." },
  { year: "2023", text: "Streaming platform and mobile app launch to 1M+ downloads." },
  { year: "2026", text: "TV Channel becomes the country's most-watched independent broadcaster." },
];

const management = [
  { name: "Ranjan De Silva", role: "Chief Executive Officer", image: "https://picsum.photos/seed/mgmt-1/300/300" },
  { name: "Priyanka Wickrama", role: "Chief Content Officer", image: "https://picsum.photos/seed/mgmt-2/300/300" },
  { name: "Tharindu Bandara", role: "Head of News", image: "https://picsum.photos/seed/mgmt-3/300/300" },
  { name: "Sanduni Peris", role: "Chief Technology Officer", image: "https://picsum.photos/seed/mgmt-4/300/300" },
];

export default function AboutPage() {
  return (
    <div className="pb-24 pt-32 lg:pt-40">
      <div className="container-page max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">About Us</span>
        <h1 className="mt-2 font-display text-4xl font-bold">Twenty-two years of telling the nation&apos;s stories</h1>
        <p className="mt-4 text-text-muted">
          TV Channel is an independent national broadcaster delivering live television, original
          drama, music, sport and trusted journalism to millions of households every week.
        </p>
      </div>

      <div className="container-page mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl glass p-5 text-center">
            <p className="font-display text-3xl font-bold text-gradient">{s.value}</p>
            <p className="mt-1 text-xs text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="container-page mt-16 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl glass p-8">
          <Target className="h-6 w-6 text-accent" />
          <h2 className="mt-3 font-display text-xl font-semibold">Our Mission</h2>
          <p className="mt-2 text-sm text-text-muted">
            To inform, entertain and connect every household in the country with content that
            reflects who we are — honestly, ambitiously and without compromise.
          </p>
        </div>
        <div className="rounded-2xl glass p-8">
          <Eye className="h-6 w-6 text-accent" />
          <h2 className="mt-3 font-display text-xl font-semibold">Our Vision</h2>
          <p className="mt-2 text-sm text-text-muted">
            To be the most trusted and most watched media platform in the region, on every screen,
            in every home.
          </p>
        </div>
      </div>

      <div className="container-page mt-16">
        <h2 className="font-display text-2xl font-bold">Our History</h2>
        <ol className="mt-8 space-y-8 border-l border-white/10 pl-6">
          {milestones.map((m) => (
            <li key={m.year} className="relative">
              <span className="absolute -left-7.75 top-1 h-3 w-3 rounded-full bg-primary-light" />
              <p className="font-display text-lg font-bold text-accent">{m.year}</p>
              <p className="mt-1 text-sm text-text-muted">{m.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="container-page mt-16">
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
          <Users className="h-5 w-5 text-accent" /> Management
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {management.map((m) => (
            <div key={m.name} className="text-center">
              <div className="relative mx-auto aspect-square w-full max-w-40 overflow-hidden rounded-2xl">
                <Image src={m.image} alt={m.name} fill className="object-cover" sizes="160px" />
              </div>
              <h3 className="mt-3 text-sm font-semibold">{m.name}</h3>
              <p className="text-xs text-text-muted">{m.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page mt-16 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl glass p-8">
          <Award className="h-6 w-6 text-accent" />
          <h2 className="mt-3 font-display text-xl font-semibold">Awards</h2>
          <ul className="mt-3 space-y-2 text-sm text-text-muted">
            <li>Best News Broadcast — National Media Awards, 2025</li>
            <li>Best Original Drama — Crimson Hour, 2024</li>
            <li>Broadcaster of the Year, 2023</li>
          </ul>
        </div>
        <div className="rounded-2xl glass p-8">
          <MapPin className="h-6 w-6 text-accent" />
          <h2 className="mt-3 font-display text-xl font-semibold">Coverage</h2>
          <p className="mt-2 text-sm text-text-muted">
            Terrestrial broadcast across all nine provinces, satellite coverage nationwide, and
            live streaming available worldwide via the TV Channel app and website.
          </p>
        </div>
      </div>

      <div className="container-page mt-16 rounded-3xl glass p-10 text-center">
        <Briefcase className="mx-auto h-6 w-6 text-accent" />
        <h2 className="mt-3 font-display text-2xl font-bold">Careers at TV Channel</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-text-muted">
          We&apos;re always looking for storytellers, engineers and broadcasters who want to build
          the future of television.
        </p>
        <a href="/contact" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-secondary">
          View open roles
        </a>
      </div>
    </div>
  );
}
