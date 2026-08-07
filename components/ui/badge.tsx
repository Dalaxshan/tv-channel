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
    default: "bg-white/10 text-text",
    live: "bg-primary text-white",
    new: "bg-accent text-secondary",
    trending: "bg-linear-to-r from-primary to-primary-light text-white",
    outline: "border border-white/20 text-text-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
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
