"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

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
              Tejgaon, Dhaka-1205, Bangladesh.
              <br />
              <span className="text-cyan-400/70 text-xs font-semibold">
                Where curiosity meets innovation since 1981.
              </span>
            </p>

            <div className="text-xs space-y-1.5 text-slate-300 pt-1">
              <div>
                <span className="text-cyan-400 font-semibold">Email: </span>
                <a
                  href="mailto:gscsc.official@gmail.com"
                  className="hover:text-cyan-300 transition-colors"
                >
                  gscsc.official@gmail.com
                </a>
              </div>
              <div>
                <span className="text-cyan-400 font-semibold">Phone: </span>
                <a
                  href="tel:+8801889934482"
                  className="hover:text-cyan-300 transition-colors"
                >
                  +880 1889-934482
                </a>
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
              <a
                href="https://www.facebook.com/share/16o39tqLqv/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800"
                aria-label="Facebook"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/gscsc.official"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800"
                aria-label="Instagram"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/gscsc/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@gscsc.official"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800"
                aria-label="YouTube"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright divider */}
        <div className="border-t border-cyan-500/15 mt-8 pt-6 text-center space-y-2">
          <p className="text-xs text-slate-400">
            &copy; 1981 &ndash; 2026 Govt. Science College Science Club (GSCSC). All Rights Reserved.
          </p>
          <p className="text-[11px] text-slate-500">
            Developed by{" "}
            <a
              href="https://www.facebook.com/PreboostMarketing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline decoration-cyan-500/40 hover:decoration-cyan-300 transition-colors"
            >
              PreBOOST MARKETING
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
