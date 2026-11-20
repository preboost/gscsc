"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  getStoredContactSettings,
  fetchCloudContactSettings,
  DEFAULT_CONTACT_SETTINGS,
  ContactSettings,
} from "@/lib/contact-data";

export default function Footer() {
  const pathname = usePathname();
  const [contactSettings, setContactSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);

  useEffect(() => {
    setContactSettings(getStoredContactSettings());
    fetchCloudContactSettings().then((res) => {
      if (res && res.phone1) {
        setContactSettings(res);
      }
    });

    const handleUpdate = () => {
      setContactSettings(getStoredContactSettings());
    };

    window.addEventListener("gscsc_contact_settings_updated", handleUpdate);
    return () => window.removeEventListener("gscsc_contact_settings_updated", handleUpdate);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="w-full px-4 sm:px-6 pb-8 pt-6 pointer-events-auto relative z-20">
      <div
        className="footer-card max-w-[1150px] mx-auto rounded-3xl p-6 sm:p-10 border border-cyan-500/15"
        style={{
          background: "rgba(4, 9, 22, 0.85)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.05)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 footer-grid">
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center p-0.5 border-2 border-sky-400/50 shadow-[0_0_16px_rgba(56,189,248,0.4)] bg-slate-900/60 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="GSCSC Official Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-xl tracking-wider font-space leading-tight">
                  GSCSC
                </span>
                <span className="text-[10px] text-sky-400 font-mono tracking-widest">
                  ESTABLISHED 1981
                </span>
              </div>
            </Link>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Govt. Science College Science Club
              <br />
              {contactSettings.address || "Govt. Science College, Tejgaon, Dhaka-1215, Bangladesh"}
              <br />
              <span className="text-cyan-400/70 text-xs font-semibold">
                {contactSettings.tagline || "Where curiosity meets innovation since 1981."}
              </span>
            </p>

            <div className="text-xs space-y-1.5 text-slate-300 pt-1">
              <div>
                <span className="text-cyan-400 font-semibold">Email: </span>
                <a
                  href={`mailto:${contactSettings.email1 || "gscsc.official@gmail.com"}`}
                  className="hover:text-cyan-300 transition-colors"
                >
                  {contactSettings.email1 || "gscsc.official@gmail.com"}
                </a>
              </div>
              <div>
                <span className="text-cyan-400 font-semibold">Phone: </span>
                <a
                  href={`tel:${(contactSettings.phone1 || "+880 1914-176174").replace(/[^0-9+]/g, "")}`}
                  className="hover:text-cyan-300 transition-colors"
                >
                  {contactSettings.phone1 || "+880 1914-176174"}
                </a>
                {contactSettings.phone2 && (
                  <>
                    <span className="text-slate-500 mx-1.5">/</span>
                    <a
                      href={`tel:${contactSettings.phone2.replace(/[^0-9+]/g, "")}`}
                      className="hover:text-cyan-300 transition-colors"
                    >
                      {contactSettings.phone2}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <Link href="/about" className="hover:text-cyan-300 transition-colors">
                  About GSCSC
                </Link>
              </li>
              <li>
                <Link href="/about/history" className="hover:text-cyan-300 transition-colors">
                  45 Years of Legacy
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-cyan-300 transition-colors">
                  10 Specialized Wings
                </Link>
              </li>
              <li>
                <Link href="/falcon" className="font-bold hover:underline inline-block">
                  <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                    GSC FALCON
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Activities & Community */}
          <div>
            <h4 className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
              Activities &amp; Community
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <Link href="/events" className="hover:text-cyan-300 transition-colors">
                  Events &amp; Festivals
                </Link>
              </li>
              <li>
                <Link href="/achievements" className="hover:text-cyan-300 transition-colors">
                  Achievements &amp; Awards
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-cyan-300 transition-colors">
                  Research &amp; Projects
                </Link>
              </li>
              <li>
                <Link href="/workshops" className="hover:text-cyan-300 transition-colors">
                  Workshops
                </Link>
              </li>
              <li>
                <Link href="/publications" className="hover:text-cyan-300 transition-colors">
                  Publications &amp; Papers
                </Link>
              </li>
              <li>
                <Link href="/panel/executive" className="hover:text-cyan-300 transition-colors">
                  Current Executives
                </Link>
              </li>
              <li>
                <Link href="/panel/ex-panelist" className="hover:text-cyan-300 transition-colors">
                  Alumni &amp; Former Panels
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect & Policies */}
          <div>
            <h4 className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
              Connect &amp; Policies
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <Link
                  href="/join-us"
                  className="text-cyan-400 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Apply for Membership &rarr;
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-300 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/developer" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                  Developer &amp; Collaboration
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-white transition-colors text-[0.75rem]">
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link href="/terms-of-services" className="hover:text-cyan-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-cyan-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 mt-6 text-slate-400">
              {contactSettings.facebookPage && (
                <a
                  href={contactSettings.facebookPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800"
                  aria-label="Facebook"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {contactSettings.instagram && (
                <a
                  href={contactSettings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800"
                  aria-label="Instagram"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {contactSettings.linkedin && (
                <a
                  href={contactSettings.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800"
                  aria-label="LinkedIn"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              )}
              {contactSettings.youtube && (
                <a
                  href={contactSettings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800"
                  aria-label="YouTube"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
              {contactSettings.discord && (
                <a
                  href={contactSettings.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800"
                  aria-label="Discord"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright divider */}
        <div className="border-t border-cyan-500/15 mt-8 pt-6 text-center space-y-2">
          <p className="text-xs text-slate-400">
            &copy; 1981 &ndash; 2026 Govt. Science College Science Club (GSCSC). All Rights Reserved.
          </p>
          <p className="text-[11px] text-slate-500">
            Developed &amp; Maintained in collaboration with{" "}
            <Link
              href="/developer"
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline decoration-cyan-500/40 hover:decoration-cyan-300 transition-colors"
            >
              PreBOOST MARKETING
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
