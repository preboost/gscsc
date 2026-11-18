"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText, BookOpen, Megaphone, Camera, Award, Star,
  Rocket, Globe, Cpu, FlaskConical, ArrowRight, ChevronRight, Sparkles, Layers
} from "lucide-react";
import { getStoredDepartments, fetchCloudDepartments, DEFAULT_DEPARTMENTS, DepartmentItem } from "@/lib/departments-data";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentItem[]>(DEFAULT_DEPARTMENTS);

  useEffect(() => {
    const load = () => {
      setDepartments(getStoredDepartments());
    };
    load();

    fetchCloudDepartments().then((cloudList) => {
      if (cloudList && cloudList.length > 0) setDepartments(cloudList);
    });

    window.addEventListener("gscsc_departments_updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("gscsc_departments_updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  return (
    <main className="subpage-main min-h-screen relative z-10 px-3 sm:px-6 pb-24 max-w-[1150px] mx-auto">
      {/* Header */}
      <div className="pt-8 sm:pt-12 pb-10 sm:pb-14 text-center max-w-3xl mx-auto flex flex-col items-center justify-center">
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

        {/* Badge */}
        <div className="flex justify-center mb-4 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-950/40 backdrop-blur-md text-sky-300 text-xs font-semibold tracking-wide">
            <Layers size={14} className="text-sky-400" />
            <span>ORGANIZATIONAL STRUCTURE &bull; 10 SPECIALIZED WINGS</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4">
          The <span className="text-shimmer">Departments</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-base leading-relaxed px-2">
          From astrophysics and sounding rocketry to national science olympiads and software engineering &mdash; explore the ten operational wings driving GSCSC.
        </p>
      </div>

      {/* Grid of All Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
        {departments.map((dept, idx) => {
          return (
            <div
              key={dept.id || idx}
              className="glass-card p-6 sm:p-7 flex flex-col justify-between group hover:border-cyan-400/60 transition-all duration-300"
            >
              <div>
                {/* Department Image & Badge */}
                {dept.image && (
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 border border-cyan-500/20 shadow-md bg-slate-950">
                    <img
                      src={dept.image}
                      alt={dept.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-2.5 left-3">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] font-bold">
                        WING #{idx + 1}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {dept.title}
                  </h3>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {dept.desc}
                </p>

                {dept.activities && dept.activities.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-cyan-500/15 mb-4">
                    <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-2 font-mono">
                      Key Activities &amp; Focus Areas:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {dept.activities.map((act, actIdx) => (
                        <li key={actIdx} className="flex items-start gap-2">
                          <span className="text-cyan-400 mt-0.5">&bull;</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-between">
                <Link
                  href={`/join-us?department=${encodeURIComponent(dept.title)}`}
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
                >
                  <span>Apply for this Wing</span>
                  <ArrowRight size={13} />
                </Link>
                <span className="text-[10px] text-slate-500 font-mono">
                  Active in 2025&ndash;2026
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-14 p-8 rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-cyan-950/50 to-blue-950/50 text-center">
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
          Ready to join one of these specialized wings?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6">
          Whether you are into rocket flight trials, coding artificial intelligence, or writing science journalism, there is a place for you at GSCSC.
        </p>
        <Link href="/join-us" className="btn-primary text-xs sm:text-sm inline-flex items-center gap-2">
          <span>Submit Membership Application</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </main>
  );
}
