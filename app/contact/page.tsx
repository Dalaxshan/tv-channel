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
    <div className="container-page pb-24 pt-22 lg:pt-30">
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
              <p className="text-sm text-text-muted">236/1 Denzil Kobbekaduwa Mawatha, Battaramulla 10120</p>
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
              className="h-full w-full"
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d727.6895795429439!2d79.92574432826245!3d6.898887154821035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae257005c0057a7%3A0x9c6c2d6bceea8b83!2sBusiness%20Media%20International!5e0!3m2!1sen!2slk!4v1787889202907!5m2!1sen!2slk"
            />


          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
