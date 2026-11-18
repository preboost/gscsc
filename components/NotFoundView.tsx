"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, Code2, AlertTriangle, Sparkles } from "lucide-react";

export default function NotFoundView() {
  return (
    <main className="min-h-screen relative z-10 flex items-center justify-center px-4 py-24">
      <div className="relative max-w-xl w-full text-center">
        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-sky-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Glass Container */}
        <div className="relative z-10 rounded-3xl p-8 sm:p-12 border border-sky-500/30 bg-slate-950/80 backdrop-blur-2xl shadow-2xl shadow-sky-950/50">
          {/* Logo Badge */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl p-2 border border-sky-400/40 bg-slate-900/80 shadow-[0_0_25px_rgba(56,189,248,0.35)] flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="GSCSC Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>

          {/* 404 Big Numbers */}
          <div className="relative inline-block mb-4">
            <span className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-sky-300 to-sky-600 tracking-tighter drop-shadow-[0_0_35px_rgba(56,189,248,0.5)]">
              404
            </span>
            <div className="absolute -bottom-2 inset-x-0 mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full shadow-[0_0_15px_#38bdf8]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider mb-4 mt-2">
            <AlertTriangle size={13} className="text-rose-400" />
            <span>Anomaly: Page Not Found</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Sector Coordinates Unavailable
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-8">
            The page you requested is unavailable, decommissioned, or currently restricted under maintenance protocol.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="btn-primary text-xs sm:text-sm font-bold flex items-center gap-2 py-2.5 px-6 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
            >
              <Home size={15} />
              <span>Return to Homepage</span>
            </Link>

            <Link
              href="/developer"
              className="btn-secondary text-xs sm:text-sm font-semibold flex items-center gap-2 py-2.5 px-5"
            >
              <Code2 size={15} />
              <span>Developer Portal</span>
            </Link>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 font-mono mt-6">
          Govt. Science College Science Club &bull; Est. 1981
        </p>
      </div>
    </main>
  );
}
