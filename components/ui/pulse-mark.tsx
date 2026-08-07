export function PulseMark({ className = "h-6 w-16" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0 16H16L22 4L30 28L38 12L44 20L52 16H120"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PulseDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 28"
      preserveAspectRatio="none"
      fill="none"
      className={`pulse-divider ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 14H60L70 2L84 26L96 8L106 20L118 14H280L290 2L304 26L316 8L326 20L336 14H400"
        stroke="url(#pulse-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="pulse-grad" x1="0" y1="0" x2="400" y2="0">
          <stop offset="0%" stopColor="#e50914" stopOpacity="0" />
          <stop offset="15%" stopColor="#e50914" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="85%" stopColor="#e50914" />
          <stop offset="100%" stopColor="#e50914" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
