import { useState } from "react";
import { Share2, X } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaX,
  FaYoutube,
} from "react-icons/fa6";

export function SocialIcons() {
  const [open, setOpen] = useState(false);

  const socials = [
    {
      name: "YouTube",
      href: "https://www.youtube.com/@AluthmaEka",
      color: "#FF0000",
      svg: <FaYoutube className="h-4.5 w-4.5" />,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/aluthmaeka/",
      color: "#E4405F",
      svg: <FaInstagram className="h-4.5 w-4.5" />,
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/AluthmaEkaTV",
      color: "#1877F2",
      svg: <FaFacebook className="h-4.5 w-4.5" />,
    },
    {
      name: "Twitter",
      href: "https://x.com/AluthmaEka",
      color: "#000000",
      svg: <FaX className="h-4.5 w-4.5" />,
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@aluthmaeka",
      color: "#000",
      svg: <FaTiktok className="h-4.5 w-4.5" />,
    },
    {
      name: "Threads",
      href: "https://www.threads.com/@aluthmaeka",
      color: "#000000",
      svg: <FaThreads className="h-4.5 w-4.5" />,
    },
    {
      name: "Telegram",
      href: "https://t.me/AluthmaEka",
      color: "#26A5E4",
      svg: <FaTelegram className="h-4.5 w-4.5" />,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/yourprofile",
      color: "#0A66C2",
      svg: <FaLinkedin className="h-4.5 w-4.5" />,
    },
  ];

  return (
    <div className="fixed right-3 bottom-10 z-40 flex flex-col items-center gap-2.5">
      {/* Expandable icons */}
      <div
        className={`flex flex-col items-center gap-2.5 transition-all duration-300 ${
          open ? "mb-1" : "mb-0"
        }`}
      >
        {socials.map((social, i) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md ring-1 ring-white/20 transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg ${
              open
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-50 translate-y-3 pointer-events-none"
            }`}
            style={{
              backgroundColor: social.color,
              transitionDelay: open
                ? `${i * 35}ms`
                : `${(socials.length - i) * 20}ms`,
            }}
          >
            <span className="h-4.5 w-4.5">{social.svg}</span>

            {/* Tooltip */}
            <span className="pointer-events-none absolute right-12 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
              {social.name}
            </span>
          </a>
        ))}
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close social menu" : "Open social menu"}
        aria-expanded={open}
        className={`flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg ring-2 ring-white/30 backdrop-blur transition-all duration-300 hover:scale-105 active:scale-95 ${
          open
            ? "bg-neutral-800 rotate-90"
            : "bg-gradient-to-br from-blue-500 to-blue-800"
        }`}
      >
        {open ? <X className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
      </button>
    </div>
  );
}