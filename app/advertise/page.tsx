import type { Metadata } from "next";
import { Check, Download } from "lucide-react";
import { stats } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Advertise With Us",
  description: "Reach millions of viewers across TV, streaming and digital with TV Channel's advertising packages.",
  alternates: { canonical: "/advertise" },
};

const packages = [
  { name: "Digital Starter", price: "From $500/mo", features: ["Homepage banner", "Newsletter mention", "Basic analytics"] },
  { name: "Broadcast Plus", price: "From $2,500/mo", features: ["Prime-time TV spots", "Digital banner package", "Monthly reporting", "Priority placement"], featured: true },
  { name: "National Partner", price: "Custom", features: ["Full-channel sponsorship", "Custom content integration", "Dedicated account manager", "Cross-platform campaign"] },
];

export default function AdvertisePage() {
  return (
    <div className="container-page pb-24 pt-32 lg:pt-40">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Partner With Us</span>
        <h1 className="mt-2 font-display text-4xl font-bold">Advertise With TV Channel</h1>
        <p className="mt-3 text-text-muted">
          Reach a nationwide audience across broadcast, streaming and digital - with packages built
          for every budget.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl glass p-5 text-center">
            <p className="font-display text-3xl font-bold text-gradient">{s.value}</p>
            <p className="mt-1 text-xs text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className={`rounded-2xl p-8 ${pkg.featured ? "glass glow-primary ring-1 ring-primary/40" : "glass"}`}
          >
            <h3 className="font-display text-lg font-semibold">{pkg.name}</h3>
            <p className="mt-1 text-2xl font-bold text-accent">{pkg.price}</p>
            <ul className="mt-5 space-y-2.5">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-text-muted">
                  <Check className="h-4 w-4 shrink-0 text-accent" /> {f}
                </li>
              ))}
            </ul>
            <Button className="mt-6 w-full" variant={pkg.featured ? "primary" : "outline"}>
              Get Started
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center justify-between gap-4 rounded-2xl glass p-8 sm:flex-row">
        <div>
          <h3 className="font-display text-lg font-semibold">Media Kit</h3>
          <p className="mt-1 text-sm text-text-muted">Full audience demographics, ratings and ad specs.</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4" /> Download Media Kit
        </Button>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold">Talk to our sales team</h2>
          <p className="mt-2 text-sm text-text-muted">Tell us about your campaign and we&apos;ll follow up within one business day.</p>
        </div>
        <ContactForm department="Advertising" />
      </div>
    </div>
  );
}
