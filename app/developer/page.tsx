"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Mail,
  Globe,
  Code2,
  Cpu,
  Layers,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Share2
} from "lucide-react";

export default function DeveloperPage() {
  return (
    <main className="subpage-main min-h-screen relative z-10 px-3 sm:px-6 pb-24 max-w-[1150px] mx-auto">
      {/* Top Back Navigation */}
      <div className="pt-6 sm:pt-8 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/50 hover:bg-slate-800/70 border border-sky-500/20 text-xs text-sky-300 font-medium backdrop-blur-md transition-all"
        >
          <ArrowLeft size={14} />
          Back to Homepage
        </Link>
      </div>

      {/* ── Collaborative Hero Header ── */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        {/* Dual Brand Identity Badge */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
          {/* GSCSC Emblem */}
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-2 border-2 border-sky-400/60 shadow-[0_0_30px_rgba(56,189,248,0.45)] bg-slate-900/80 backdrop-blur-xl flex items-center justify-center transform group-hover:scale-105 transition-all">
              <Image
                src="/logo.png"
                alt="GSCSC Official Logo"
                width={80}
                height={80}
                priority
                quality={100}
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
            <span className="block text-[10px] text-sky-300 font-mono font-bold tracking-widest mt-2 uppercase">
              GSCSC
            </span>
          </div>

          {/* Multiplication / Cross Icon */}
          <div className="flex flex-col items-center justify-center text-slate-400">
            <span className="text-xl sm:text-2xl font-black text-cyan-400">&times;</span>
          </div>

          {/* PreBOOST Marketing Logo */}
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-2 border-2 border-blue-500/60 shadow-[0_0_30px_rgba(37,99,235,0.45)] bg-white backdrop-blur-xl flex items-center justify-center transform group-hover:scale-105 transition-all overflow-hidden">
              <Image
                src="/preboost-logo.jpg"
                alt="PreBOOST MARKETING Official Logo"
                width={80}
                height={80}
                priority
                quality={100}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <span className="block text-[10px] text-blue-400 font-mono font-bold tracking-widest mt-2 uppercase">
              PreBOOST
            </span>
          </div>
        </div>

        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 backdrop-blur-md text-sky-300 text-xs font-semibold uppercase tracking-wider mb-4 font-mono">
          <Sparkles size={13} className="text-sky-400" />
          <span>OFFICIAL DIGITAL ARCHITECTURE &amp; COLLABORATION</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          Website Development &amp; <span className="text-shimmer">Digital Collaboration</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
          A collaborative initiative by{" "}
          <span className="text-sky-300 font-bold">Govt. Science College Science Club</span> &times;{" "}
          <span className="text-blue-400 font-bold">PreBOOST MARKETING</span>.
        </p>
      </div>

      {/* ── Main Narrative Showcase Card ── */}
      <div className="relative rounded-3xl p-6 sm:p-10 lg:p-12 border border-sky-500/25 bg-slate-950/70 backdrop-blur-2xl shadow-2xl shadow-black/70 mb-12 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-sky-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-6 text-slate-200 text-sm sm:text-base leading-relaxed">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shrink-0 mt-1">
              <Code2 size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                Digital Presence &amp; Modern Architecture
              </h2>
              <p className="text-slate-300 leading-relaxed">
                The official website of Govt. Science College Science Club (GSCSC) has been designed and developed in collaboration with <strong className="text-white font-semibold">PreBOOST MARKETING</strong>, aiming to establish a modern, accessible, and engaging digital presence for the club.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 pt-2">
            <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-400/30 text-blue-400 shrink-0 mt-1">
              <Rocket size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                End-to-End Execution &amp; Innovation
              </h2>
              <p className="text-slate-300 leading-relaxed">
                From website planning and UI/UX design to development and deployment, <strong className="text-white font-semibold">PreBOOST MARKETING</strong> has contributed its digital expertise to bring this platform to life. This collaboration reflects a shared commitment to innovation, technology, and the digital advancement of science-based communities.
              </p>
            </div>
          </div>

          {/* Highlight Quote Pill */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900/50 border border-sky-400/30 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-sky-200">
                A collaborative initiative by Govt. Science College Science Club &times; PreBOOST MARKETING.
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-bold tracking-wider uppercase">
              Official Release &bull; 2026
            </span>
          </div>
        </div>
      </div>

      {/* ── Connect with PreBOOST MARKETING Section ── */}
      <div className="rounded-3xl border border-sky-500/20 bg-slate-950/60 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-3 font-mono">
            <span>GET IN TOUCH</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            Connect with PreBOOST MARKETING
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2">
            For website development, digital solutions, business inquiries, or collaboration opportunities, feel free to reach out to us through our official channels.
          </p>
          <p className="text-xs text-slate-400">
            Our lead developer &bull;{" "}
            <a
              href="https://junaedislamjim.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline decoration-cyan-500/40 hover:decoration-cyan-300 transition-colors inline-flex items-center gap-1"
            >
              junaedislamjim.pages.dev
              <ExternalLink size={11} />
            </a>
          </p>
        </div>

        {/* Contact Channel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Email Card */}
          <a
            href="mailto:preboostmarketing@gmail.com"
            className="glass-card p-5 rounded-2xl border-sky-500/20 hover:border-sky-400/50 bg-slate-900/40 hover:bg-slate-900/70 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                <Mail size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Official Email</span>
                <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Send Email
                </span>
              </div>
            </div>
            <div className="text-xs text-sky-300 font-mono break-all pt-2 border-t border-slate-800">
              preboostmarketing@gmail.com
            </div>
          </a>

          {/* Facebook Card */}
          <a
            href="https://www.facebook.com/preboostmarketing"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-5 rounded-2xl border-blue-500/20 hover:border-blue-400/50 bg-slate-900/40 hover:bg-slate-900/70 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Share2 size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Facebook Page</span>
                <span className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1">
                  PreBOOST Marketing <ExternalLink size={12} />
                </span>
              </div>
            </div>
            <div className="text-xs text-blue-300 font-mono break-all pt-2 border-t border-slate-800">
              facebook.com/preboostmarketing
            </div>
          </a>

          {/* Official Website Card */}
          <a
            href="https://www.preboost.website"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-5 rounded-2xl border-cyan-500/20 hover:border-cyan-400/50 bg-slate-900/40 hover:bg-slate-900/70 transition-all group flex flex-col justify-between sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Globe size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Official Website</span>
                <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                  Visit preboost.website <ExternalLink size={12} />
                </span>
              </div>
            </div>
            <div className="text-xs text-cyan-300 font-mono break-all pt-2 border-t border-slate-800">
              https://www.preboost.website
            </div>
          </a>
        </div>

        {/* Agency Brand Statement Footer */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden border border-blue-400/40">
              <Image
                src="/preboost-logo.jpg"
                alt="PreBOOST Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white font-space">PreBOOST MARKETING</span>
              <p className="text-[11px] text-cyan-400 font-medium">Your Digital Growth Partner.</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Crafting Scalable Web &bull; Modern UI/UX &bull; Digital Innovation
          </div>
        </div>
      </div>
    </main>
  );
}
