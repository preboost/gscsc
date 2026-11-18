"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Sparkles, BookOpen, FileText, Download, ExternalLink } from "lucide-react";
import {
  getStoredPublications,
  fetchCloudPublications,
  DEFAULT_PUBLICATIONS,
  PublicationItem,
  getStoredFeaturedPublication,
  fetchCloudFeaturedPublication,
  DEFAULT_FEATURED_PUBLICATION,
  FeaturedPublication,
} from "@/lib/publications-data";

export default function PublicationsPage() {
  const [publications, setPublications] = useState<PublicationItem[]>(DEFAULT_PUBLICATIONS);
  const [featured, setFeatured] = useState<FeaturedPublication>(DEFAULT_FEATURED_PUBLICATION);

  useEffect(() => {
    const load = () => {
      setPublications(getStoredPublications());
      setFeatured(getStoredFeaturedPublication());
    };
    load();

    // Live edge cloud sync
    fetchCloudPublications().then((cloudList) => {
      if (cloudList && cloudList.length > 0) setPublications(cloudList);
    });
    fetchCloudFeaturedPublication().then((cloudFeatured) => {
      if (cloudFeatured) setFeatured(cloudFeatured);
    });

    window.addEventListener("gscsc_publications_updated", load);
    window.addEventListener("gscsc_featured_publication_updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("gscsc_publications_updated", load);
      window.removeEventListener("gscsc_featured_publication_updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return (
    <main className="subpage-main min-h-screen relative z-10 px-3 sm:px-6 pb-24 max-w-[1150px] mx-auto">
      {/* Top Navigation */}
      <div className="pt-6 sm:pt-8 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/50 hover:bg-slate-800/70 border border-sky-500/20 text-xs text-sky-300 font-medium backdrop-blur-md transition-all"
        >
          <ArrowLeft size={14} />
          Back to Homepage
        </Link>
      </div>

      {/* Centered Club Logo Header */}
      <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto mb-10 sm:mb-12">
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
            <span>ANNUAL PUBLICATION &bull; GSCSC</span>
          </div>
        </div>
      </div>

      {/* ── Main Feature Showcase ── */}
      <div className="relative rounded-3xl p-6 sm:p-10 lg:p-12 border border-sky-500/25 bg-slate-950/60 backdrop-blur-2xl shadow-2xl shadow-black/60 mb-16 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-sky-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Magazine Cover Presentation */}
          <div className="lg:col-span-5 flex justify-center items-center">
            {featured.coverImage ? (
              <div className="relative group w-[260px] sm:w-[320px] aspect-[1/1.42] rounded-2xl overflow-hidden border-2 border-sky-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(56,189,248,0.25)] transition-all duration-500 group-hover:scale-[1.02] bg-slate-900">
                <img
                  src={featured.coverImage}
                  alt={featured.englishTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[10px] font-mono tracking-widest text-sky-300 uppercase px-2 py-0.5 rounded bg-black/60 border border-sky-400/30 w-fit mb-1 backdrop-blur-md">
                    {featured.tag || "FLAGSHIP"}
                  </div>
                  <div className="text-sm font-bold text-white drop-shadow-md">
                    {featured.bengaliTitle} &bull; {featured.englishTitle}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative group w-[260px] sm:w-[320px] aspect-[1/1.42] rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-sky-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(56,189,248,0.25)] flex flex-col justify-between overflow-hidden transition-all duration-500 group-hover:scale-[1.02]">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono tracking-widest text-sky-300 uppercase px-2 py-0.5 rounded bg-black/40 border border-sky-400/30">
                      {featured.tag || "FLAGSHIP"}
                    </span>
                    <div className="w-6 h-6 rounded-full border border-sky-400/50 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-sky-300">GSC</span>
                    </div>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                    {featured.bengaliTitle || "সবিকল্প"}
                  </h2>
                  <div className="text-xs font-mono font-bold tracking-widest text-sky-400 mt-1 uppercase">
                    {featured.englishTitle || "SHOBIKOLPO"}
                  </div>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/10 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Special Issue</div>
                    <div className="text-xs font-bold text-white">{featured.specialIssue || "Annual Edition"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Est. 1981</div>
                    <div className="text-xs font-bold text-sky-300">Tejgaon, Dhaka</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Editorial Overview */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md font-mono w-fit mb-4">
              <Sparkles size={13} className="text-sky-400" />
              <span>{featured.badge || "Flagship Science Anthology"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-2">
              {featured.bengaliTitle}
            </h1>

            <div className="inline-flex items-center gap-2 mb-6">
              <span className="text-sm sm:text-base font-bold text-sky-300">
                {featured.englishTitle}
              </span>
              <span className="text-slate-500">&bull;</span>
              <span className="text-xs sm:text-sm font-medium text-slate-400">
                {featured.subtitle}
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-8">
              {featured.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500/20 via-blue-600/30 to-sky-500/20 border-2 border-sky-400/50 text-white font-bold text-sm sm:text-base shadow-[0_0_25px_rgba(56,189,248,0.35)] backdrop-blur-xl">
                <Clock className="w-5 h-5 text-sky-400 animate-pulse" />
                <span className="tracking-wide">{featured.statusText || "Coming Soon"}</span>
              </div>
              {featured.downloadUrl ? (
                <a
                  href={featured.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-400 text-slate-950 font-bold text-sm hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                >
                  <Download size={16} />
                  <span>Download / Read Online</span>
                </a>
              ) : (
                <span className="text-xs text-slate-400 font-mono">
                  {featured.statusSubtext || "Currently in Editorial & Print Phase"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Read Previous Editions Section ── */}
      <div>
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-sky-500/20">
          <BookOpen className="text-sky-400 w-5 h-5" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-sky-400">
            Read Editions &amp; Publications ({publications.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publications.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-6 border-sky-500/20 hover:border-sky-400/50 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group"
            >
              <div>
                {item.coverImage && (
                  <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 border border-sky-500/20 bg-slate-950">
                    <img src={item.coverImage} alt={item.edition} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[10px] font-bold font-mono">
                    {item.year}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">{item.pages}</span>
                </div>

                <div className="text-2xl font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                  {item.bengali}
                </div>
                <div className="text-xs font-bold text-sky-400 font-mono uppercase tracking-wider mb-3">
                  {item.edition}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-sky-500/15 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{item.type}</span>
                {item.downloadUrl ? (
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-bold group-hover:underline"
                  >
                    <Download size={13} />
                    <span>Read PDF</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-bold">
                    <FileText size={13} />
                    <span>Archived</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
