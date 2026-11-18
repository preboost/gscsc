"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Search,
  Phone,
  Mail,
  RotateCw,
  Award,
  GraduationCap,
  BookOpen,
  Briefcase
} from "lucide-react";
import { DEFAULT_MODERATORS, Moderator } from "@/lib/moderators-data";

export default function ModeratorsPage() {
  const [moderators, setModerators] = useState<Moderator[]>(DEFAULT_MODERATORS);
  const [search, setSearch] = useState("");
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  useEffect(() => {
    function load() {
      try {
        const stored = localStorage.getItem("gscsc_club_moderators");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setModerators(parsed);
            return;
          }
        }
      } catch {
        // fallback
      }
      setModerators(DEFAULT_MODERATORS);
    }

    load();
    window.addEventListener("gscsc_moderators_updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("gscsc_moderators_updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const toggleFlip = (id: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filtered = moderators
    .filter((m) => {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.designation.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q) ||
        m.tag.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));

  return (
    <main className="subpage-main min-h-screen pt-8 sm:pt-12 pb-24 px-3 sm:px-6 max-w-[1250px] mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/50 hover:bg-slate-800/70 border border-sky-500/20 text-xs text-sky-300 font-medium backdrop-blur-md transition-all"
        >
          <ArrowLeft size={14} />
          Back to Homepage
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 flex flex-col items-center justify-center">
        {/* Centered Top Logo */}
        <div className="flex justify-center mb-4 sm:mb-5 w-full">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 border-2 border-sky-400/60 shadow-[0_0_30px_rgba(56,189,248,0.45)] bg-slate-900/70 backdrop-blur-xl flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="GSCSC Official Logo"
              width={96}
              height={96}
              priority
              quality={100}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        <div className="flex justify-center mb-3 w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-300 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md font-mono">
            <Sparkles size={12} className="text-sky-400" />
            <span>FACULTY ADVISORY &amp; MENTORSHIP BOARD</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Club <span className="text-shimmer">Moderators</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2 max-w-2xl">
          Eminent professors and dedicated faculty members of Govt. Science College guiding our young scientists, Olympiad contestants, research divisions, and national events. Click on any moderator&apos;s photo to view contact details.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 p-4 sm:p-5 rounded-3xl border border-sky-500/25 bg-slate-950/60 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" />
          <input
            type="text"
            placeholder="Search by name, department, designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-sky-500/25 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-sky-400 transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-sky-400 font-bold">{filtered.length}</span> of {moderators.length} mentors
        </div>
      </div>

      {/* ─── 3D Interactive Flip Cards Grid (Full Photo Front / Details Back) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filtered.map((m) => {
          const isFlipped = flippedCards[m.id] || false;

          return (
            <div
              key={m.id}
              className={`flip-card-container h-[490px] w-full cursor-pointer select-none group transition-transform duration-300 hover:-translate-y-1 ${
                isFlipped ? "is-flipped" : ""
              }`}
              onClick={() => toggleFlip(m.id)}
              role="button"
              tabIndex={0}
              aria-label={`Toggle details for ${m.name}`}
            >
              <div className="flip-card-inner">
                {/* ════════ FRONT FACE: FULL BLEED PICTURE ════════ */}
                <div className="flip-card-front relative w-full h-full rounded-3xl overflow-hidden border border-sky-500/30 bg-slate-950 shadow-2xl shadow-black/70 group-hover:border-sky-400/60 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] transition-all">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.95] contrast-[1.05] transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-sky-950 flex flex-col items-center justify-center">
                      <div className="w-28 h-28 rounded-full bg-sky-500/20 border-2 border-sky-400/40 flex items-center justify-center text-sky-300 font-extrabold text-4xl shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                        {m.name.charAt(0)}
                      </div>
                      <span className="text-slate-400 text-xs mt-3">Photo Pending</span>
                    </div>
                  )}

                  {/* Top Floating Glass Badge */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 pointer-events-none z-10">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold tracking-wide shadow-lg truncate max-w-[240px]">
                      {m.tag || "Faculty Mentor"}
                    </span>
                    <span className="p-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                      <Award size={13} />
                    </span>
                  </div>

                  {/* Bottom Vignette Overlay */}
                  <div
                    className="absolute inset-x-0 bottom-0 pt-20 pb-5 px-5 z-10 flex flex-col justify-end"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(3, 7, 18, 0.98) 0%, rgba(3, 7, 18, 0.85) 55%, rgba(3, 7, 18, 0.4) 80%, transparent 100%)",
                    }}
                  >
                    <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                      {m.name}
                    </h2>
                    <p className="text-cyan-400 text-xs font-bold tracking-wide mt-1 drop-shadow">
                      {m.designation}
                    </p>
                    <p className="text-slate-300 text-[11px] mt-1 line-clamp-1 opacity-90">
                      {m.department}
                    </p>

                    {/* Flip Trigger Button */}
                    <div className="mt-3.5 inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 text-xs font-semibold backdrop-blur-md shadow-lg shadow-sky-950/40 transition-colors">
                      <RotateCw size={13} className="text-sky-400 group-hover:rotate-180 transition-transform duration-500" />
                      <span>Click photo to view details</span>
                    </div>
                  </div>
                </div>

                {/* ════════ BACK FACE: DETAILS & CONTACT ════════ */}
                <div
                  className="flip-card-back relative w-full h-full rounded-3xl overflow-hidden p-6 flex flex-col justify-between border-2 border-sky-400/50 shadow-2xl shadow-sky-950/50"
                  style={{
                    background:
                      "linear-gradient(155deg, rgba(6, 16, 42, 0.98) 0%, rgba(3, 8, 24, 0.99) 100%)",
                    backdropFilter: "blur(24px)",
                  }}
                >
                  <div>
                    {/* Header: Mini Avatar & Name */}
                    <div className="flex items-center gap-3 pb-3 border-b border-sky-500/25 mb-3.5">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400/60 flex-shrink-0 bg-slate-900 shadow-md">
                        {m.photo ? (
                          <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-cyan-400 font-bold text-lg">
                            {m.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-white leading-tight truncate">
                          {m.name}
                        </h3>
                        <p className="text-[11px] text-cyan-400 font-bold tracking-wide truncate">
                          {m.designation}
                        </p>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {m.department}
                        </span>
                      </div>
                    </div>

                    {/* Scrollable details container */}
                    <div className="space-y-2.5 text-xs max-h-[300px] overflow-y-auto pr-1">
                      {/* Email */}
                      {m.email && (
                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/70 border border-sky-500/20">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                            <Mail size={13} className="text-sky-400" />
                            Official Email:
                          </span>
                          <a
                            href={`mailto:${m.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-[11px] text-sky-300 truncate max-w-[170px] hover:underline"
                          >
                            {m.email}
                          </a>
                        </div>
                      )}

                      {/* Academic Department Details */}
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-sky-500/20">
                        <div className="text-[10px] font-mono uppercase text-sky-400 font-bold flex items-center gap-1.5 mb-1">
                          <GraduationCap size={13} />
                          <span>Institution &amp; Faculty</span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">
                          {m.department}
                        </p>
                        <p className="text-[11px] text-cyan-300/80 mt-0.5">
                          {m.tag}
                        </p>
                      </div>

                      {/* Biography & Mentorship Focus */}
                      {m.bio && (
                        <div className="p-3 rounded-xl bg-slate-950/70 border border-sky-500/20">
                          <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5 mb-1">
                            <BookOpen size={13} />
                            <span>Mentorship &amp; Advisory Role</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {m.bio}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Flip Back Button */}
                  <div className="pt-3 border-t border-sky-500/20 mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlip(m.id);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <RotateCw size={12} className="text-sky-400" />
                      <span>Click to view photo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 p-8 rounded-3xl border border-sky-500/20 bg-slate-950/60 backdrop-blur-xl">
          <p className="text-slate-400 text-sm">No faculty mentors found matching your search.</p>
        </div>
      )}
    </main>
  );
}
