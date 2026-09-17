import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "live" | "new" | "trending" | "outline";
}) {
  const variants: Record<string, string> = {
    default:
      "bg-primary-light/10 backdrop-blur-md border border-primary-light/15 text-text",
    live: "bg-primary/80 backdrop-blur-md border border-white/15 text-white shadow-[0_0_16px_-2px_rgba(59,116,232,0.6)]",
    new: "bg-accent/80 backdrop-blur-md border border-white/15 text-secondary",
    trending:
      "bg-linear-to-r from-primary/80 to-primary-light/80 backdrop-blur-md border border-white/15 text-white",
    outline: "border border-primary-light/25 bg-primary-light/5 backdrop-blur-md text-text-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors duration-300",
        variants[variant],
        className
      )}
    >
      {variant === "live" && (
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-live" />
      )}
      {children}
    </span>
  );
}
