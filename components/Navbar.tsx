"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  Rocket,
  Award,
  Sparkles,
  BookOpen,
  FileText,
  Users,
  Calendar,
  Trophy,
  Cpu,
  Handshake,
  Layers,
  ArrowRight,
  Send,
  UserPlus
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>("activities");
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const toggleMobileAccordion = (section: string) => {
    setMobileExpanded((prev) => (prev === section ? null : section));
  };

  const closeMobile = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pt-3 pb-2 px-3 pointer-events-auto">
      <div
        ref={navRef}
        className={`nav-bar mx-auto flex items-center justify-between px-4 sm:px-6 h-[54px] rounded-full transition-all duration-300 max-w-[1150px] ${
          isScrolled ? "shadow-[0_18px_45px_rgba(0,0,0,0.7),0_0_25px_rgba(14,165,233,0.25)] border-sky-400/40 bg-[#060c1c]/80" : ""
        }`}
      >
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center p-0.5 border border-sky-400/50 shadow-[0_0_15px_rgba(56,189,248,0.5)] bg-slate-900/60">
            <Image
              src="/logo.png"
              alt="GSCSC Official Logo"
              width={36}
              height={36}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-[1.1rem] tracking-wider group-hover:text-sky-400 transition-colors font-space leading-tight">
              GSCSC
            </span>
            <span className="text-[9px] text-sky-400 font-mono tracking-widest hidden sm:block">
              EST. 1981
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {/* Home */}
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              pathname === "/" ? "text-cyan-400 bg-cyan-500/10" : "text-slate-300 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            Home
          </Link>

          {/* About Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("about")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold inline-flex items-center gap-1 transition-all ${
                pathname.startsWith("/about")
                  ? "text-cyan-400 bg-cyan-500/10"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <span>About</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === "about" ? "rotate-180 text-cyan-400" : ""}`} />
            </button>
            {openDropdown === "about" && (
              <div
                className="absolute top-full left-0 mt-2 w-60 rounded-2xl p-2 border border-cyan-500/20 shadow-2xl z-50 animate-fadeInMenu"
                style={{ background: "rgba(5, 12, 28, 0.95)", backdropFilter: "blur(20px)" }}
              >
                <Link href="/about" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
                  <BookOpen size={15} className="text-cyan-400" />
                  <span>About GSCSC (Est. 1981)</span>
                </Link>
                <Link href="/about#founder" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
                  <Sparkles size={15} className="text-cyan-400" />
                  <span>Founder&apos;s Tribute</span>
                </Link>
                <Link href="/about/history" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
                  <Calendar size={15} className="text-cyan-400" />
                  <span>44 Years History</span>
                </Link>
              </div>
            )}
          </div>

          {/* Departments */}
          <Link
            href="/departments"
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              pathname === "/departments" ? "text-cyan-400 bg-cyan-500/10" : "text-slate-300 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            Departments
          </Link>

          {/* Activities Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("activities")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold inline-flex items-center gap-1 transition-all ${
                ["/events", "/workshops", "/projects", "/publications", "/falcon", "/achievements"].some(p => pathname.startsWith(p))
                  ? "text-cyan-400 bg-cyan-500/10"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <span>Activities</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === "activities" ? "rotate-180 text-cyan-400" : ""}`} />
            </button>
            {openDropdown === "activities" && (
              <div
                className="absolute top-full left-0 mt-2 w-64 rounded-2xl p-2 border border-cyan-500/20 shadow-2xl z-50 animate-fadeInMenu"
                style={{ background: "rgba(5, 12, 28, 0.95)", backdropFilter: "blur(20px)" }}
              >
                <Link href="/events" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
                  <Calendar size={15} className="text-cyan-400" />
                  <span>Events &amp; Festivals</span>
                </Link>
                <Link href="/workshops" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
                  <Cpu size={15} className="text-cyan-400" />
                  <span>Workshops</span>
                </Link>
                <Link href="/projects" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
                  <Sparkles size={15} className="text-cyan-400" />
                  <span>Research &amp; Projects</span>
                </Link>
                <Link href="/publications" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
                  <FileText size={15} className="text-cyan-400" />
                  <span>Publications &amp; Papers</span>
                </Link>
                <div className="my-1 border-t border-cyan-500/15" />
                <Link href="/falcon" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-cyan-400 hover:bg-cyan-500/15 transition-colors">
                  <Rocket size={15} className="text-cyan-400 animate-pulse" />
                  <span>GSC Falcon (Rocketry Wing)</span>
                </Link>
                <Link href="/achievements" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
                  <Trophy size={15} className="text-cyan-400" />
                  <span>Achievements &amp; Awards</span>
                </Link>
              </div>
            )}
          </div>

          {/* Executive Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("panel")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold inline-flex items-center gap-1 transition-all ${
                pathname.startsWith("/panel") || pathname.startsWith("/moderators")
                  ? "text-cyan-400 bg-cyan-500/10"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <span>Executive</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === "panel" ? "rotate-180 text-cyan-400" : ""}`} />
            </button>
            {openDropdown === "panel" && (
              <div
                className="absolute top-full left-0 mt-2 w-64 rounded-2xl p-2 border border-cyan-500/20 shadow-2xl z-50 animate-fadeInMenu"
                style={{ background: "rgba(5, 12, 28, 0.95)", backdropFilter: "blur(20px)" }}
              >
                <Link href="/panel/executive" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
                  <Users size={15} className="text-cyan-400" />
                  <span>Executive Panel</span>
                </Link>
                <Link href="/moderators" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
                  <Award size={15} className="text-cyan-400" />
                  <span>Club Moderators</span>
                </Link>
                <Link href="/panel/ex-panelist" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors">
                  <BookOpen size={15} className="text-cyan-400" />
                  <span>Alumni &amp; Former Panels</span>
                </Link>
              </div>
            )}
          </div>

          {/* Contact */}
          <Link
            href="/contact"
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              pathname === "/contact" ? "text-cyan-400 bg-cyan-500/10" : "text-slate-300 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-2">
          <Link
            href="/join-us"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-white transition-all transform hover:scale-105 shadow-[0_0_16px_rgba(56,189,248,0.35)]"
            style={{
              background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
            }}
          >
            <span>Join Us</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-200 hover:text-white p-2 rounded-xl bg-slate-900/60 border border-sky-500/20 focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} className="text-cyan-400" /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 📱 Mobile Drawer with Interactive Accordion Dropdowns for About, Activities, Executive 📱 */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-x-3 top-[68px] z-50 rounded-3xl p-4 sm:p-5 border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-fadeInMenu max-h-[82vh] overflow-y-auto"
          style={{ background: "rgba(5, 12, 28, 0.98)", backdropFilter: "blur(28px)" }}
        >
          <div className="space-y-1.5 text-sm">
            {/* 1. Home */}
            <Link
              href="/"
              onClick={closeMobile}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold transition-colors ${
                pathname === "/" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <span>Home</span>
              <ArrowRight size={14} className="text-slate-500" />
            </Link>

            {/* 2. About Accordion Dropdown */}
            <div className="rounded-2xl border border-sky-500/15 bg-slate-900/40 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleMobileAccordion("about")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 font-bold text-slate-200 hover:text-white text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen size={16} className="text-cyan-400" />
                  <span>About GSCSC</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-cyan-400 transition-transform duration-200 ${
                    mobileExpanded === "about" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileExpanded === "about" && (
                <div className="px-2 pb-2.5 pt-0.5 space-y-1 border-t border-sky-500/10 bg-slate-950/60">
                  <Link
                    href="/about"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <BookOpen size={14} className="text-cyan-400" />
                    <span>About GSCSC (Est. 1981)</span>
                  </Link>
                  <Link
                    href="/about#founder"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Sparkles size={14} className="text-cyan-400" />
                    <span>Founder&apos;s Tribute</span>
                  </Link>
                  <Link
                    href="/about/history"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Calendar size={14} className="text-cyan-400" />
                    <span>44 Years History</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Departments */}
            <Link
              href="/departments"
              onClick={closeMobile}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold transition-colors ${
                pathname === "/departments" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers size={16} className="text-cyan-400" />
                <span>The 10 Departments</span>
              </div>
              <ArrowRight size={14} className="text-slate-500" />
            </Link>

            {/* 4. Activities Accordion Dropdown */}
            <div className="rounded-2xl border border-sky-500/15 bg-slate-900/40 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleMobileAccordion("activities")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 font-bold text-slate-200 hover:text-white text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar size={16} className="text-cyan-400" />
                  <span>Activities</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-cyan-400 transition-transform duration-200 ${
                    mobileExpanded === "activities" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileExpanded === "activities" && (
                <div className="px-2 pb-2.5 pt-0.5 space-y-1 border-t border-sky-500/10 bg-slate-950/60">
                  <Link
                    href="/events"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Calendar size={14} className="text-cyan-400" />
                    <span>Events &amp; Festivals</span>
                  </Link>
                  <Link
                    href="/workshops"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Cpu size={14} className="text-cyan-400" />
                    <span>Workshops</span>
                  </Link>
                  <Link
                    href="/projects"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Sparkles size={14} className="text-cyan-400" />
                    <span>Research &amp; Projects</span>
                  </Link>
                  <Link
                    href="/publications"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <FileText size={14} className="text-cyan-400" />
                    <span>Publications &amp; Papers</span>
                  </Link>
                  <Link
                    href="/falcon"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-cyan-400 hover:bg-cyan-500/15"
                  >
                    <Rocket size={14} className="text-cyan-400 animate-pulse" />
                    <span>GSC Falcon (Rocketry Wing)</span>
                  </Link>
                  <Link
                    href="/achievements"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Trophy size={14} className="text-cyan-400" />
                    <span>Achievements &amp; Awards</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 5. Executive Accordion Dropdown */}
            <div className="rounded-2xl border border-sky-500/15 bg-slate-900/40 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleMobileAccordion("executive")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 font-bold text-slate-200 hover:text-white text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Users size={16} className="text-cyan-400" />
                  <span>Executive &amp; Panels</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-cyan-400 transition-transform duration-200 ${
                    mobileExpanded === "executive" ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileExpanded === "executive" && (
                <div className="px-2 pb-2.5 pt-0.5 space-y-1 border-t border-sky-500/10 bg-slate-950/60">
                  <Link
                    href="/panel/executive"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Users size={14} className="text-cyan-400" />
                    <span>Executive Panel</span>
                  </Link>
                  <Link
                    href="/moderators"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Award size={14} className="text-cyan-400" />
                    <span>Club Moderators</span>
                  </Link>
                  <Link
                    href="/panel/ex-panelist"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <BookOpen size={14} className="text-cyan-400" />
                    <span>Alumni &amp; Former Panels</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 6. Contact */}
            <Link
              href="/contact"
              onClick={closeMobile}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold transition-colors ${
                pathname === "/contact" ? "bg-cyan-500/20 text-cyan-300" : "text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Send size={16} className="text-cyan-400" />
                <span>Contact</span>
              </div>
              <ArrowRight size={14} className="text-slate-500" />
            </Link>

            {/* 7. Join Us CTA Button */}
            <div className="pt-2">
              <Link
                href="/join-us"
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-xs font-bold text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] border border-sky-400/40"
                style={{
                  background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                }}
              >
                <span>Join GSCSC Today</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
