"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Compass, Sparkles, Award, Globe, Users, ArrowRight, Quote, Calendar, BookmarkCheck } from "lucide-react";
import { getStoredData, DEFAULT_ABOUT, AboutData } from "@/lib/cmsData";

export default function AboutPage() {
  const [data, setData] = useState<AboutData>(DEFAULT_ABOUT);

  useEffect(() => {
    setData(getStoredData("about", DEFAULT_ABOUT));
  }, []);

  return (
    <main className="subpage-main min-h-screen relative z-10 px-4 sm:px-6 pb-24 max-w-[1150px] mx-auto">
      {/* Header with Official GSCSC Logo */}
      <div className="pt-8 sm:pt-14 pb-10 sm:pb-14 text-center max-w-2xl mx-auto flex flex-col items-center justify-center">
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
            <Calendar size={14} className="text-sky-400" />
            <span>ESTABLISHED IN {data.establishedYear} &bull; 44 YEARS OF LEGACY</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Empowering <span className="text-shimmer">Scientific Inquiry</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-base leading-relaxed px-2">
          {data.heroStory}
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Compass className="text-cyan-400" />
            Our Mission
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            {data.mission}
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">▸</span> Hands-on laboratory and rocketry workshops
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">▸</span> National &amp; International Olympiad mentoring
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">▸</span> Peer-to-peer student research publishing
            </li>
          </ul>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="text-cyan-400" />
            Our Vision
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            {data.vision}
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">▸</span> Championing critical thinking in higher secondary education
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">▸</span> Connecting collegiate minds with global aerospace &amp; tech
            </li>
            <li className="flex items-center gap-2">
              <span className="text-cyan-400">▸</span> Expanding Bangladesh&apos;s youth science movement
            </li>
          </ul>
        </div>
      </div>

      {/* Founder's Tribute Section */}
      <section id="founder" className="mb-16 scroll-mt-24">
        <div className="glass-card p-8 sm:p-12 border-cyan-500/25 relative overflow-hidden">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 lg:gap-12">
            {/* Founder Photo */}
            <div className="flex-shrink-0 text-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-2 border-cyan-400/40 p-1 shadow-[0_0_30px_rgba(56,189,248,0.25)] bg-slate-900 mx-auto relative">
                <img
                  src={data.founderPhoto || "/founder-santosh-kumar-roy.jpg"}
                  alt={data.founderName || "Founding Patron Prof. Santosh Kumar Roy"}
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/founder-santosh-kumar-roy.jpg";
                  }}
                />
              </div>
              <div className="mt-3">
                <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[0.7rem] font-bold">
                  Class of 1981
                </span>
              </div>
            </div>

            {/* Founder Biography & Tribute Message */}
            <div className="flex-1 min-w-0 text-center md:text-left">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest block mb-1">
                Founder&apos;s Tribute
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
                {data.founderName}
              </h2>
              <p className="text-cyan-300/80 text-xs font-medium mb-4">
                {data.founderTitle}
              </p>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                {data.founderBio}
              </p>

              {/* Founder Quote */}
              <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 relative">
                <Quote size={20} className="text-cyan-400/40 mb-2" />
                <p className="text-slate-200 text-xs sm:text-sm italic leading-relaxed">
                  &ldquo;{data.founderQuote}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nav Link Pillars */}
      <div className="glass-card p-8 sm:p-10 border-cyan-500/20 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Explore Our Organization</h3>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-6">
          Learn about our 44-year journey, meet the executive panel guiding the club, or explore our 10 specialized wings.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/about/history" className="btn-primary text-xs">
            Our 44 Years History &rarr;
          </Link>
          <Link href="/departments" className="btn-secondary text-xs">
            The 10 Departments &rarr;
          </Link>
          <Link href="/panel/executive" className="btn-secondary text-xs">
            Current Executive Panel &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
