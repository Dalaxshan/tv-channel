import Link from "next/link";
import { PulseMark } from "@/components/ui/pulse-mark";
import { NewsletterForm } from "@/components/home/newsletter";
import {
  FacebookIcon,
  InstagramIcon,
  XIcon,
  YoutubeIcon,
} from "../ui/social-icons";
import Image from "next/image";

const columns = [
  {
    title: "Watch",
    links: [
      { label: "Live TV", href: "/watch-live" },
      { label: "Programs", href: "/programs" },
      { label: "TV Schedule", href: "/schedule" },
      { label: "Video Library", href: "/videos" },
    ],
  },
  {
    title: "News",
    links: [
      { label: "Latest News", href: "/news" },
      { label: "Politics", href: "/news?category=Politics" },
      { label: "Business", href: "/news?category=Business" },
      { label: "Sports", href: "/news?category=Sports" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Presenters", href: "/presenters" },
      { label: "Advertise With Us", href: "/advertise" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Careers", href: "/careers" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-secondary/60 pt-16">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_2fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <PulseMark className="h-6 w-14 text-primary-light" />
              <span className="font-display text-2xl font-bold">
                TV<span className="text-primary-light">Channel</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-text-muted">
              The nation&apos;s home for live television, original drama,
              breaking news and the moments everyone will be talking about
              tomorrow.
            </p>
            <div className="mt-6 flex gap-3">
              {[FacebookIcon, InstagramIcon, YoutubeIcon, XIcon].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label="Social link"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-text-muted hover:border-primary hover:text-primary-light transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ),
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="font-display text-sm font-semibold text-text">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-text-muted hover:text-accent transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-text">
              Stay in the loop
            </h3>
            <p className="mt-3 text-sm text-text-muted">
              New episodes, breaking news and schedule changes - straight to
              your inbox.
            </p>
            <NewsletterForm compact />
            <div className="mt-0 flex gap-1 ">
              <a
                href="#"
                className=" px-3 py-2 text-xs text-text-muted hover:border-white/30"
              >
               <Image src="/app-store.svg" alt="App Store" width={120} height={30} />
              </a>
              <a
                href="#"
                className=" px-3 py-2 text-xs text-text-muted hover:border-white/30"
              >
               <Image src="/google-play.svg" alt="Google Play" width={120} height={30} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-1 flex flex-col items-center border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} TV Channel Network. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
