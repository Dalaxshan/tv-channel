"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // In production: POST to /api/newsletter
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
        <Check className="h-4 w-4" /> You&apos;re subscribed - welcome aboard.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "mt-4" : "mt-6 flex flex-col sm:flex-row gap-3 max-w-md"}>
      <label htmlFor={compact ? "footer-email" : "newsletter-email"} className="sr-only">
        Email address
      </label>
      <div className="relative flex-1">
        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          id={compact ? "footer-email" : "newsletter-email"}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-text-muted focus:border-accent"
        />
      </div>
      <Button type="submit" variant={compact ? "outline" : "accent"} size={compact ? "sm" : "md"}>
        Subscribe
      </Button>
    </form>
  );
}

export function NewsletterSection() {
  return (
    <section className="container-page py-16 lg:py-24">
      <div className="relative overflow-hidden rounded-3xl glass p-10 lg:p-16 text-center">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/30 blur-[100px]" />
        <div className="relative">
          <SectionHeading
            eyebrow="Newsletter"
            title="Never miss a moment"
            description="Weekly episode drops, breaking news alerts and schedule updates - delivered every Friday."
            className="justify-center text-center [&>div]:mx-auto"
          />
          <div className="flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
