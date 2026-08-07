import { Apple, PlayCircle, Bell, Bookmark, WifiOff, QrCode } from "lucide-react";

const features = [
  { icon: Bell, label: "Live episode & schedule alerts" },
  { icon: Bookmark, label: "Bookmark shows to watch later" },
  { icon: WifiOff, label: "Download and watch offline" },
];

export function AppPromo() {
  return (
    <section id="app-promo" className="container-page py-16 lg:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-secondary to-background p-10 lg:p-16">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/25 blur-[110px]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
              TV Channel, Everywhere
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Take live TV with you
            </h2>
            <p className="mt-3 max-w-lg text-sm text-text-muted sm:text-base">
              Download the TV Channel app for a full-screen streaming experience, tailored recommendations and instant breaking news alerts.
            </p>
            <ul className="mt-6 space-y-3">
              {features.map((f) => (
                <li key={f.label} className="flex items-center gap-3 text-sm text-text-muted">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-accent">
                    <f.icon className="h-4 w-4" />
                  </span>
                  {f.label}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#" className="flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium hover:border-white/30">
                <Apple className="h-5 w-5" /> App Store
              </a>
              <a href="#" className="flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium hover:border-white/30">
                <PlayCircle className="h-5 w-5" /> Google Play
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-3 rounded-2xl glass p-6">
              <QrCode className="h-28 w-28 text-text" strokeWidth={1} />
              <p className="text-xs text-text-muted">Scan to download</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
