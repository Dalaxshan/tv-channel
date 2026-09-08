"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import type { ContactFormData } from "@/types";

const departments = ["General Inquiry", "News Desk", "Advertising", "Technical Support"];

export function ContactForm({ department }: { department?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "");
    formData.append("subject", "New Contact Form Submission");
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone ?? "");
    formData.append("service", data.service ?? department ?? "");
    formData.append("message", data.message);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-6 text-accent">
        <Check className="h-5 w-5 shrink-0" />
        <p className="text-sm">Thanks — your message has been sent. We&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl glass p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">Full Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Enter your full name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">Email Address</label>
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Enter your email address"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent"
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-muted">Phone (optional)</label>
        <input
          {...register("phone")}
          type="tel"
          placeholder="Enter your phone number"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>

      {!department && (
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-muted">Inquiry Type</label>
          <select
            {...register("service", { required: "Please select a type of inquiry" })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent"
          >
            <option value="" className="text-black">Select an option</option>
            {departments.map((opt) => (
              <option key={opt} value={opt} className="text-black">{opt}</option>
            ))}
          </select>
          {errors.service && <p className="mt-1 text-xs text-red-400">{errors.service.message}</p>}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-muted">Message</label>
        <textarea
          {...register("message", { required: "Message is required" })}
          rows={5}
          placeholder="How can we help you?"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-accent"
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
