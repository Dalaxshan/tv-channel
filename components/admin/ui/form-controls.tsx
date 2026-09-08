"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export function Field({
  label,
  htmlFor,
  error,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-200">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }>(
  function Input({ className = "", hasError, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`w-full rounded-md border bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${
          hasError
            ? "border-red-600 focus:ring-red-600/40"
            : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/40"
        } ${className}`}
        {...props}
      />
    );
  }
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }
>(function Textarea({ className = "", hasError, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={`w-full rounded-md border bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 ${
        hasError
          ? "border-red-600 focus:ring-red-600/40"
          : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/40"
      } ${className}`}
      {...props}
    />
  );
});

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    loading?: boolean;
  }
>(function Button({ className = "", variant = "primary", loading, disabled, children, ...props }, ref) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500",
    ghost: "bg-transparent text-slate-300 hover:bg-slate-800 focus-visible:ring-slate-500",
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

export function Spinner({ className = "h-6 w-6" }: { className?: string }) {
  return <Loader2 className={`animate-spin text-indigo-500 ${className}`} />;
}
