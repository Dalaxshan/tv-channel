"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Globe,
  ChevronDown,
} from "lucide-react";
import { PulseMark } from "@/components/ui/pulse-mark";
import { SearchModal } from "@/components/layout/search-modal";
import { shows } from "@/lib/data";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Programs",
    href: "/programs",
    mega: true,
  },
  { label: "TV Schedule", href: "/schedule" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-light", light);
  }, [light]);

  const categories = Array.from(new Set(shows.map((s) => s.category)));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black theme-light:bg-zinc-100" : "bg-transparent"
        }`}
      >
        <div className="container-page flex h-16 lg:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="TV Channel home">
            <PulseMark className="h-6 w-14 text-primary-light" />
            <span className="font-display text-xl lg:text-2xl font-bold tracking-tight">
              TV<span className="text-primary-light">Channel</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            {navLinks.map((link) =>
              link.mega ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <button
                    className="flex items-center gap-1 px-4 py-2 text-md font-medium theme-light:text-text-muted hover:theme-light:text-text transition-colors"
                    aria-expanded={megaOpen}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.75 }}
                        className="absolute left-1/2 top-full mt-2 w-140 -translate-x-1/2 rounded-2xl bg-white p-6 shadow-2xl"
                      >
                        <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                          {categories.map((cat) => (
                            <Link
                              key={cat}
                              href={`/programs?category=${cat}`}
                              className="text-sm text-text-muted hover:text-accent transition-colors"
                            >
                              {cat}
                            </Link>
                          ))}
                        </div>
                        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                          <p className="text-xs text-text-muted">
                            Browse all {shows.length}+ original shows
                          </p>
                          <Link
                            href="/programs"
                            className="text-xs font-semibold text-accent hover:underline"
                          >
                            View all programs →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-md font-medium theme-light:text-text-muted hover:theme-light:text-text transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <div className="flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Open search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setLight((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {light ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>
            <button
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Change language"
            >
              <Globe className="h-4.5 w-4.5" />
            </button>
            {/* <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/watch-live">
                <Radio className="h-3.5 w-3.5" />
                Watch Live
              </Link>
            </Button> */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex lg:hidden h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-background/98 backdrop-blur-xl lg:hidden"
          >
            <div className="container-page flex h-16 items-center justify-between">
              <PulseMark className="h-6 w-14 text-primary-light" />
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="container-page mt-6 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3.5 text-xl font-display font-medium border-b border-white/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
