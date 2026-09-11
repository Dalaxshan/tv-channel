"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {CookieConsent } from "@/components/layout/floating-widgets";
import { SocialIcons } from "@/components/home/social-icon";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminPanel = pathname?.startsWith("/admin-panel");

  if (isAdminPanel) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
       <SocialIcons />
      <Footer />
     <CookieConsent />
     
    </>
  );
}
