import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-6 mb-8", className)}>
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
          {eyebrow}
        </span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text">{title}</h2>
        {description && (
          <p className="mt-2 max-w-xl text-sm md:text-base text-text-muted">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-text hover:text-accent transition-colors"
        >
          {action.label}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      )}
    </div>
  );
}
