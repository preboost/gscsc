"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Select all sections, glass cards, and elements marked for scroll reveal
    const elements = document.querySelectorAll(
      ".reveal-scroll, section:not(.hero-section), .glass-card, .footer-card"
    );

    elements.forEach((el) => {
      // Add base class if not present
      if (!el.classList.contains("reveal-scroll")) {
        el.classList.add("reveal-scroll");
      }
    });

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            // Keep observing or unobserve to freeze in revealed state
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
