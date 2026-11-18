"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Cpu, Rocket, Eye, Terminal, Calendar, MapPin, Sparkles, ExternalLink, CheckCircle } from "lucide-react";
import { getStoredWorkshops, DEFAULT_WORKSHOPS, WorkshopItem } from "@/lib/workshops-data";

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<WorkshopItem[]>(DEFAULT_WORKSHOPS);

  useEffect(() => {
    const load = () => {
      setWorkshops(getStoredWorkshops());
    };
    load();
    window.addEventListener("gscsc_workshops_updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("gscsc_workshops_updated", load);
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

      {/* Header */}
      <div className="pt-4 pb-12 sm:pb-16 text-center max-w-3xl mx-auto flex flex-col items-center justify-center">
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
            <Cpu size={12} className="text-sky-400" />
            <span>HANDS-ON TECHNICAL &amp; RESEARCH BOOTCAMPS</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Club <span className="text-shimmer">Workshops</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2">
          From rocket propellant synthesis and autonomous microcontrollers to deep-space telescopy, gain hands-on engineering experience under expert guidance.
        </p>
      </div>

      {/* Workshop Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {workshops.map((ws) => (
          <div
            key={ws.id}
            className="glass-card rounded-3xl p-6 sm:p-8 border border-sky-500/25 hover:border-sky-400/60 flex flex-col justify-between transition-all duration-300 shadow-2xl shadow-black/50 group"
          >
            <div>
              {/* 16:9 Image Container (1920x1080 Aspect Ratio) */}
              <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-5 relative border border-sky-500/20 bg-slate-950/80">
                <img
                  src={ws.image}
                  alt={ws.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${ws.badgeColor || "border-sky-500/30 bg-sky-950/40 text-sky-300"}`}>
                    {ws.badge}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-sky-400/30 text-sky-300 text-xs font-semibold">
                    {ws.status}
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-sky-300 transition-colors">
                {ws.title}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                {ws.desc}
              </p>

              {/* Schedule & Location Details */}
              <div className="space-y-2 text-xs text-slate-300 mb-6 p-4 rounded-2xl bg-sky-950/30 border border-sky-500/15">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-sky-400 flex-shrink-0" />
                  <span>{ws.date} &bull; {ws.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-sky-400 flex-shrink-0" />
                  <span>{ws.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-sky-400 flex-shrink-0" />
                  <span>Conducted by: <strong className="text-white">{ws.lead}</strong></span>
                </div>
              </div>

              {/* Curriculum Topics */}
              {ws.topics && ws.topics.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 mb-2.5">
                    What You Will Learn:
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {ws.topics.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle size={13} className="text-sky-400 flex-shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-sky-500/20">
              <a
                href={ws.regLink || "https://forms.gle/gscsc-workshop"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center text-xs py-2.5 font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)]"
              >
                <span>Register for Workshop</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
