"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackToTop, CookieConsent } from "@/components/layout/floating-widgets";
import { SocialIcons } from "@/components/home/social-icon";

/**
 * The public site's chrome (navbar, footer, floating widgets) should never
 * appear on the standalone /admin-panel section, which has its own sidebar
 * layout. Everything else renders exactly as before - no design changes to
 * any existing page.
 */
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
      
      {/* <BackToTop /> */}
      <CookieConsent />
     
    </>
  );
}
