"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFoundView from "@/components/NotFoundView";
import DeveloperPage from "@/app/developer/page";
import {
  getSiteLockdownState,
  fetchCloudSiteLockdownState,
  LOCKDOWN_EVENT,
} from "@/lib/siteMode";

export default function SiteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [lockdown, setLockdown] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHydrated(true);
    setLockdown(getSiteLockdownState());

    // Fetch latest state from Cloudflare KV edge
    fetchCloudSiteLockdownState().then((state) => {
      setLockdown(state);
    });

    const handleLockdownEvent = (e: any) => {
      if (e?.detail?.enabled !== undefined) {
        setLockdown(e.detail.enabled);
      } else {
        setLockdown(getSiteLockdownState());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "gscsc_site_lockdown_mode") {
        setLockdown(e.newValue === "true");
      }
    };

    window.addEventListener(LOCKDOWN_EVENT, handleLockdownEvent);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(LOCKDOWN_EVENT, handleLockdownEvent);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // SAFEGUARD: The administrator panel (/admin, /admin/*) must ALWAYS remain accessible
  // so the administrator can never be locked out and can toggle lockdown mode off at any time.
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  // When lockdown is enabled
  if (hydrated && lockdown) {
    // Homepage displays the developer page
    if (pathname === "/") {
      return (
        <>
          <Navbar />
          <div className="relative z-10">
            <DeveloperPage />
          </div>
          <Footer />
        </>
      );
    }

    // Direct visits to /developer or /developers display the developer page
    if (pathname === "/developer" || pathname === "/developers") {
      return (
        <>
          <Navbar />
          <div className="relative z-10">
            <DeveloperPage />
          </div>
          <Footer />
        </>
      );
    }

    // All other public routes return 404 (Not Found)
    return <NotFoundView />;
  }

  // Normal live mode: everything is visible as usual
  return (
    <>
      <Navbar />
      <div className="relative z-10">{children}</div>
      <Footer />
    </>
  );
}
