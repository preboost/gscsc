"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Check, ArrowRight, Compass, Shield, Atom, Rocket, Star, Eye } from "lucide-react";

interface FontOption {
  id: string;
  name: string;
  category: string;
  tag: string;
  headingFont: string;
  bodyFont: string;
  headingClass: string;
  bodyClass: string;
  description: string;
  recommended?: boolean;
}

const fontOptions: FontOption[] = [
  {
    id: "space-grotesk",
    name: "Space Grotesk + Outfit",
    category: "Astrophysics & Interstellar NASA",
    tag: "⭐ Most Recommended",
    headingFont: "Space Grotesk",
    bodyFont: "Outfit",
    headingClass: "font-space",
    bodyClass: "font-outfit",
    description: "আধুনিক কসমিক ও ডিপ স্পেস ভাইব। ইন্টারস্টেলার, ব্ল্যাকহোল ও ৪K ভিডিও ব্যাকগ্রাউন্ডের সাথে সবচেয়ে গর্জিয়াস দেখায়।",
    recommended: true,
  },
  {
    id: "orbitron",
    name: "Orbitron + Plus Jakarta",
    category: "Futuristic Cyber & Sci-Fi",
    tag: "⚡ High-Tech Cyber",
    headingFont: "Orbitron",
    bodyFont: "Plus Jakarta Sans",
    headingClass: "font-orbitron",
    bodyClass: "font-jakarta",
    description: "একদম সাই-ফাই ফিল্ম ও সাইবারনেটিক লুক। বোল্ড, জিওমেট্রিক এবং ফিউচারিস্টিক স্পেস টেকনোলজির আবহ তৈরি করে।",
  },
  {
    id: "rajdhani",
    name: "Rajdhani + Outfit",
    category: "Aerospace & GSC Falcon Wing",
    tag: "🚀 Rocketry & Aerospace",
    headingFont: "Rajdhani",
    bodyFont: "Outfit",
    headingClass: "font-rajdhani",
    bodyClass: "font-outfit",
    description: "শার্প, মেটালিক ও অ্যারোস্পেস লুক। প্রজেক্ট ফ্যালকন ও রিসার্চ ল্যাবের টেকনিক্যাল প্রজেক্টের সাথে অসাধারণ মানানসই।",
  },
  {
    id: "syne",
    name: "Syne + Plus Jakarta",
    category: "Ultra-Modern Silicon Valley Glass",
    tag: "💎 Luxury Modern",
    headingFont: "Syne",
    bodyFont: "Plus Jakarta Sans",
    headingClass: "font-syne",
    bodyClass: "font-jakarta",
    description: "সিলিকন ভ্যালি স্টার্টআপ ও আধুনিক অ্যাপল-স্টাইল ক্রিয়েটিভ লুক। গ্লাস কার্ডের উপর অসম্ভব ক্লিন ও প্রিমিয়াম।",
  },
  {
    id: "cinzel",
    name: "Cinzel + Outfit",
    category: "Prestigious Royal Science (1981)",
    tag: "🏛️ Royal Academic",
    headingFont: "Cinzel",
    bodyFont: "Outfit",
    headingClass: "font-cinzel",
    bodyClass: "font-outfit",
    description: "১৯৮১ সালের গৌরবময় ঐতিহ্য ও ফাউন্ডার্স ট্রিবিউটের সাথে রয়্যাল বৈজ্ঞানিক আভিজাত্যের নিখুঁত প্রকাশ।",
  },
];

export default function FontPreviewPage() {
  const [selected, setSelected] = useState<FontOption>(fontOptions[0]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-300 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
          Interactive Live Font Selector
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          GSCSC Typography Live Demo
        </h1>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
          নিচের অপশনগুলোতে ক্লিক করে দেখুন সাইটের হেডলাইন, কার্ড, বাটন ও টেক্সট কেমন দেখাবে। আপনার যেটা পছন্দ হবে বললেই সেটি পুরো ওয়েবসাইটে সেট করে দেওয়া হবে।
        </p>
      </div>

      {/* Preset Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-12">
        {fontOptions.map((opt) => {
          const isCurrent = selected.id === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt)}
              className={`p-4 rounded-2xl text-left transition-all duration-300 relative border ${
                isCurrent
                  ? "bg-sky-500/20 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.35)] scale-[1.02]"
                  : "bg-slate-900/40 hover:bg-slate-900/70 border-white/10 hover:border-sky-500/40"
              } backdrop-blur-xl`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/20">
                  {opt.tag}
                </span>
                {isCurrent && <Check className="w-4 h-4 text-sky-400" />}
              </div>
              <h3 className={`text-base font-bold text-white mb-1 ${opt.headingClass}`}>
                {opt.headingFont}
              </h3>
              <p className="text-xs text-slate-400 mb-2">
                Body: <span className="text-sky-300 font-medium">{opt.bodyFont}</span>
              </p>
              <p className="text-[11px] text-slate-400/90 line-clamp-2">
                {opt.category}
              </p>
            </button>
          );
        })}
      </div>

      {/* LIVE PREVIEW CANVAS */}
      <div className="rounded-3xl border border-sky-500/30 bg-slate-950/40 backdrop-blur-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden mb-16">
        {/* Active Preset Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-sky-500/20 mb-8">
          <div>
            <span className="text-xs text-sky-400 font-mono tracking-wider uppercase block mb-1">
              Active Typography Preview
            </span>
            <h2 className={`text-2xl md:text-3xl font-extrabold text-white ${selected.headingClass}`}>
              {selected.name}
            </h2>
            <p className={`text-sm text-slate-300 mt-1 max-w-xl ${selected.bodyClass}`}>
              {selected.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-400/20 text-xs text-sky-300 font-mono">
              Heading: {selected.headingFont}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-xs text-indigo-300 font-mono">
              Body: {selected.bodyFont}
            </span>
          </div>
        </div>

        {/* 1. Live Hero Section Mockup */}
        <div className="py-8 text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-300 text-xs font-semibold tracking-wider uppercase mb-5 backdrop-blur-md">
            <Atom className="w-4 h-4 text-sky-400" />
            Where Curiosity Meets Innovation Since 1981
          </div>

          <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-300 tracking-tight leading-tight mb-6 ${selected.headingClass}`}>
            GOVT. SCIENCE COLLEGE SCIENCE CLUB
          </h1>

          <p className={`text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 ${selected.bodyClass}`}>
            Empowering the next generation of astrophysicists, aerospace innovators, and scientific minds through discovery, high-impact research, and technological excellence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button className={`px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] transition-all flex items-center gap-2 ${selected.headingClass}`}>
              <Compass className="w-4 h-4" />
              Explore 10 Departments
            </button>
            <button className={`px-7 py-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/60 border border-sky-400/30 text-white font-bold text-sm backdrop-blur-xl transition-all flex items-center gap-2 ${selected.headingClass}`}>
              <Rocket className="w-4 h-4 text-sky-400" />
              Project GSC Falcon
            </button>
          </div>
        </div>

        {/* 2. Live Stats Bar Mockup */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-sky-400/20 bg-slate-900/30 backdrop-blur-xl mb-12">
          <div className="text-center">
            <div className={`text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400 mb-1 ${selected.headingClass}`}>
              1981
            </div>
            <div className={`text-xs text-slate-400 uppercase tracking-wider ${selected.bodyClass}`}>
              Year Established
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400 mb-1 ${selected.headingClass}`}>
              10
            </div>
            <div className={`text-xs text-slate-400 uppercase tracking-wider ${selected.bodyClass}`}>
              Active Departments
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400 mb-1 ${selected.headingClass}`}>
              500+
            </div>
            <div className={`text-xs text-slate-400 uppercase tracking-wider ${selected.bodyClass}`}>
              Active Club Members
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400 mb-1 ${selected.headingClass}`}>
              45+
            </div>
            <div className={`text-xs text-slate-400 uppercase tracking-wider ${selected.bodyClass}`}>
              National Awards
            </div>
          </div>
        </div>

        {/* 3. Live Glass Cards Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl border border-sky-400/20 bg-slate-900/30 backdrop-blur-xl hover:border-sky-400/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center mb-4 text-sky-400">
              <Atom className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400">Department 01</span>
            <h3 className={`text-xl font-bold text-white mt-1 mb-2 ${selected.headingClass}`}>
              Astro & Space Science
            </h3>
            <p className={`text-sm text-slate-300 leading-relaxed ${selected.bodyClass}`}>
              Exploring observational astronomy, planetary science, spectroscopy, and theoretical astrophysics through telescope sky-gazing sessions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl border border-sky-400/20 bg-slate-900/30 backdrop-blur-xl hover:border-sky-400/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center mb-4 text-blue-400">
              <Rocket className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400">Special Wing</span>
            <h3 className={`text-xl font-bold text-white mt-1 mb-2 ${selected.headingClass}`}>
              Project GSC Falcon
            </h3>
            <p className={`text-sm text-slate-300 leading-relaxed ${selected.bodyClass}`}>
              High-altitude sounding rockets, UAV flight telematics, aerodynamic canard simulations, and satellite payload telemetry design.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl border border-sky-400/20 bg-slate-900/30 backdrop-blur-xl hover:border-sky-400/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center mb-4 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400">Heritage</span>
            <h3 className={`text-xl font-bold text-white mt-1 mb-2 ${selected.headingClass}`}>
              Founder's Vision 1981
            </h3>
            <p className={`text-sm text-slate-300 leading-relaxed ${selected.bodyClass}`}>
              Honoring the visionary founders whose pursuit of scientific curiosity sparked four decades of leadership in student science in Bangladesh.
            </p>
          </div>
        </div>
      </div>

      {/* Side by Side Comparison Grid */}
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
          All 5 Typography Styles Side-by-Side
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fontOptions.map((opt) => (
            <div
              key={opt.id}
              onClick={() => setSelected(opt)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                selected.id === opt.id
                  ? "bg-sky-500/15 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                  : "bg-slate-900/30 border-white/10 hover:border-sky-500/30"
              } backdrop-blur-xl`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-sky-400">{opt.tag}</span>
                {selected.id === opt.id && <span className="text-xs text-sky-300 font-bold">● Active</span>}
              </div>
              <h4 className={`text-2xl font-black text-white mb-2 ${opt.headingClass}`}>
                {opt.name}
              </h4>
              <p className={`text-sm text-slate-300 mb-4 ${opt.bodyClass}`}>
                Govt. Science College Science Club is a crucible where curiosity transforms into breakthrough research.
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/10">
                <span>Heading: <strong className="text-white">{opt.headingFont}</strong></span>
                <span>Body: <strong className="text-sky-300">{opt.bodyFont}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Back */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-white font-medium text-sm transition-all"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
