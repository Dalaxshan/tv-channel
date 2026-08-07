import type { SVGProps } from "react";

function base(props: SVGProps<SVGSVGElement>) {
  return { fill: "currentColor", viewBox: "0 0 24 24", ...props };
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.6c0-.9.3-1.6 1.6-1.6h1.7V3.1C16.5 3 15.4 3 14.2 3c-2.6 0-4.4 1.6-4.4 4.5v2.2H7v3.2h2.8V21h3.7z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M22 12s0-3.2-.4-4.7a2.9 2.9 0 0 0-2-2C17.9 5 12 5 12 5s-5.9 0-7.6.3a2.9 2.9 0 0 0-2 2C2 8.8 2 12 2 12s0 3.2.4 4.7a2.9 2.9 0 0 0 2 2C6.1 19 12 19 12 19s5.9 0 7.6-.3a2.9 2.9 0 0 0 2-2C22 15.2 22 12 22 12z" fill="none" stroke="currentColor" strokeWidth={1.6} />
      <path d="M10 9.5l5 2.5-5 2.5z" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M4 3h3.6l4 5.4L16 3h3.6l-6 7.7L20 21h-3.6l-4.4-5.9L7 21H3.4l6.4-8.2L4 3z" />
    </svg>
  );
}

export function TiktokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base(props)}>
      <path d="M14 3c.3 1.8 1.5 3.2 3.4 3.6V9.3c-1.2 0-2.4-.4-3.4-1.1v6.4a5 5 0 1 1-5-5c.2 0 .4 0 .6.1v2.7a2.3 2.3 0 1 0 1.8 2.2V3H14z" />
    </svg>
  );
}
