"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Award, Medal, Sparkles, Building2, Calendar, ArrowRight } from "lucide-react";
import { getStoredData, DEFAULT_ACHIEVEMENTS, AchievementItem } from "@/lib/cmsData";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementItem[]>(DEFAULT_ACHIEVEMENTS);

  useEffect(() => {
    setAchievements(getStoredData("achievements", DEFAULT_ACHIEVEMENTS));
  }, []);

  return (
    <main className="subpage-main min-h-screen relative z-10 px-3 sm:px-6 pb-24 max-w-[1150px] mx-auto">
      {/* Header */}
      <div className="pt-8 sm:pt-12 pb-10 sm:pb-14 text-center max-w-2xl mx-auto flex flex-col items-center justify-center">
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

        {/* Badge on its own line below logo */}
        <div className="flex justify-center mb-4 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-950/40 backdrop-blur-md text-sky-300 text-xs font-semibold tracking-wide">
            <Trophy size={14} className="text-sky-400" />
            <span>HONORS &amp; MILESTONES SINCE 1981</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Club <span className="text-shimmer">Achievements</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2">
          Celebrating 45 years of national championships, olympiad medals, aerospace breakthroughs, and institutional honors.
        </p>
      </div>

      {/* Grid: Square-balanced cards with image support */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="glass-card p-5 sm:p-6 flex flex-col justify-between rounded-3xl border-sky-500/25 hover:border-sky-400/60 transition-all duration-300 shadow-xl shadow-black/40 hover:-translate-y-1.5 overflow-hidden group"
          >
            <div>
              {item.image_url ? (
                <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-4 relative border border-sky-500/20 bg-slate-950/60">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-sky-400/40 text-sky-300 text-[10px] font-bold">
                      {item.year}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Award size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
                      {item.year}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[0.68rem]">
                      {item.category}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-[10px] font-bold uppercase">
                  {item.category}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white mb-1.5 leading-snug line-clamp-2">{item.title}</h2>
              <div className="flex items-center gap-1.5 text-xs text-cyan-400/90 font-medium mb-3">
                <Building2 size={13} />
                <span>{item.awardBy}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed line-clamp-3 mb-4">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-sky-500/15 flex items-center justify-between text-xs text-slate-400">
              <span>National Recognition</span>
              <span className="text-cyan-400 font-semibold">GSCSC Merit</span>
            </div>
          </div>
        ))}
      </div>

      {/* Banner */}
      <div className="glass-card p-8 text-center border-cyan-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Represent GSCSC Nationwide</h3>
        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mb-6">
          Join our specialized training camps for Physics, Math, Informatics, and Rocketry to compete and bring honor to the college.
        </p>
        <Link href="/join-us" className="btn-primary">
          Register for Next Competition <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  );
}
