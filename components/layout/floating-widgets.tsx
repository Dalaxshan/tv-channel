"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Radio, ArrowUp, Cookie } from "lucide-react";
import { Button } from "../ui/button";

export function FloatingWatchLive() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 left-6 z-40"
        >
          <Button asChild size="lg" className="glow-primary">
            <Link href="/watch-live">
              <Radio className="h-4 w-4 animate-pulse-live" />
              Watch Live
            </Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full glass text-text hover:text-accent transition-colors"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = window.localStorage.getItem("pulsetv-cookie-consent");
    if (!dismissed) setShow(true);
  }, []);

  function dismiss() {
    window.localStorage.setItem("pulsetv-cookie-consent", "1");
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-2xl flex-col items-start gap-4 rounded-2xl glass p-5 shadow-2xl sm:flex-row sm:items-center"
        >
          <Cookie className="h-6 w-6 shrink-0 text-accent" />
          <p className="text-sm text-text-muted">
            We use cookies to personalize content and analyze traffic. By
            continuing, you agree to our{" "}
            <Link href="/cookies" className="text-accent underline underline-offset-2">
              Cookie Policy
            </Link>
            .
          </p>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={dismiss}>
              Decline
            </Button>
            <Button size="sm" onClick={dismiss}>
              Accept
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
