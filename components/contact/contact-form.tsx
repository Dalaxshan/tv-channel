"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const departments = ["General Inquiry", "News Desk", "Advertising", "Technical Support"];

export function ContactForm({ department }: { department?: string }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-6 text-accent">
        <Check className="h-5 w-5 shrink-0" />
        <p className="text-sm">Thanks - your message has been sent. We&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl glass p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" id="name" type="text" required />
        <Field label="Email address" id="email" type="email" required />
      </div>
      {!department && (
        <div>
          <label htmlFor="department" className="mb-1.5 block text-xs font-medium text-text-muted">
            Department
          </label>
          <select
            id="department"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent"
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-text-muted">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent"
          placeholder={department ? `Tell us about your ${department.toLowerCase()} needs...` : "How can we help?"}
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto">
        Send Message
      </Button>
    </form>
  );
}

function Field({ label, id, type, required }: { label: string; id: string; type: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-text-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}
