import type { Metadata } from "next";
import { MapPin, Phone, Mail, Newspaper, Wrench, MessageSquare } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with TV Channel's news desk, technical support, advertising or general inquiries team.",
  alternates: { canonical: "/contact" },
};

const departments = [
  { icon: MessageSquare, name: "General Inquiry", detail: "hello@tvchannel.example" },
  { icon: Newspaper, name: "News Desk", detail: "newsdesk@tvchannel.example" },
  { icon: Wrench, name: "Technical Support", detail: "support@tvchannel.example" },
];

export default function ContactPage() {
  return (
    <div className="container-page pb-24 pt-32 lg:pt-40">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">Get In Touch</span>
        <h1 className="mt-2 font-display text-4xl font-bold">Contact Us</h1>
        <p className="mt-3 text-text-muted">Reach the right team, faster.</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {departments.map((d) => (
              <div key={d.name} className="flex items-center gap-4 rounded-2xl glass p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 text-accent">
                  <d.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{d.name}</p>
                  <p className="text-xs text-text-muted">{d.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4 rounded-2xl glass p-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p className="text-sm text-text-muted">42 Broadcast Avenue, Colombo 03</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <p className="text-sm text-text-muted">+94 11 234 5678</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <p className="text-sm text-text-muted">hello@tvchannel.example</p>
            </div>
          </div>

          <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-white/10">
            <iframe
              title="TV Channel location map"
              className="h-full w-full grayscale invert-0"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=79.83%2C6.91%2C79.87%2C6.95&layer=mapnik"
            />
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
