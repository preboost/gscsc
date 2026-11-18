"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Rocket, FlaskConical, Eye, Cpu, Leaf, Thermometer, ArrowRight, Sparkles } from "lucide-react";
import { getStoredProjects, DEFAULT_PROJECTS, ProjectItem } from "@/lib/projects-data";

const STATUS_STYLES: Record<string, string> = {
  "Competed": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Prototype": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "Published": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "National Award": "bg-yellow-500/15 text-sky-400 border-yellow-500/30",
  "Deployed": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);

  useEffect(() => {
    const load = () => {
      setProjects(getStoredProjects());
    };
    load();
    window.addEventListener("gscsc_projects_updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("gscsc_projects_updated", load);
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
            <Sparkles size={12} className="text-sky-400" />
            <span>ORIGINAL SCIENTIFIC RESEARCH &amp; INNOVATION</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Research &amp; <span className="text-shimmer">Projects</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-base leading-relaxed px-2">
          From atmospheric telemetry rockets to agricultural computer vision, discover the breakthrough prototypes engineered by GSCSC researchers.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj, idx) => (
          <div
            key={proj.id || idx}
            className="glass-card rounded-3xl p-6 border border-sky-500/25 hover:border-sky-400/50 flex flex-col justify-between transition-all duration-300 group shadow-xl"
          >
            <div>
              {/* Project Image */}
              {proj.image && (
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 relative border border-sky-500/20 bg-slate-950">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase backdrop-blur-md ${STATUS_STYLES[proj.status] || "bg-sky-500/15 text-sky-300 border-sky-400/30"}`}>
                      {proj.status}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] text-sky-400 font-mono font-bold">
                  {proj.tag}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {proj.year}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors leading-tight">
                {proj.title}
              </h2>

              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                {proj.desc}
              </p>

              {/* Technical Specifications */}
              {proj.specs && proj.specs.length > 0 && (
                <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/15 mb-4">
                  <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-1.5 font-mono">
                    Technical Specifications:
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300 font-mono">
                    {proj.specs.map((sp, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1.5">
                        <span className="text-sky-400">&bull;</span>
                        <span>{sp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-sky-500/15 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Team: <strong className="text-white">{proj.team}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
