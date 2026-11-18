"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, GraduationCap, Users } from "lucide-react";

export default function TeamPage() {
  const leadership = [
    { name: "Prof. Md. Abdul Jalil", role: "Chief Patron & Principal", dept: "Govt. Science College", tag: "Administration" },
    { name: "Dr. Nazmul Huda", role: "Chief Moderator & Assoc. Professor", dept: "Department of Physics", tag: "Faculty Advisor" },
    { name: "Mrs. Shahnaz Parveen", role: "Co-Moderator & Asst. Professor", dept: "Department of Chemistry", tag: "Faculty Advisor" },
  ];

  const studentCoordinators = [
    { name: "Arif Hossain", role: "President", wing: "Central Committee" },
    { name: "Nusrat Jahan", role: "General Secretary", wing: "Administration" },
    { name: "Rafid Karim", role: "Treasurer & Finance Lead", wing: "Central Committee" },
    { name: "Lamia Islam", role: "Joint Secretary", wing: "Event Operations" },
    { name: "Tanvir Ahmed", role: "Head of Rocketry & Robotics", wing: "Engineering Division" },
    { name: "Farida Haque", role: "Head of Press & Media", wing: "Publications" },
    { name: "Shahriar Nafis", role: "Chief Technology Officer (IT)", wing: "Software & Web" },
    { name: "Mehedi Hasan", role: "Chief Olympiad Trainer", wing: "Academic Wings" },
  ];

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-24 px-3 sm:px-6 max-w-[1150px] mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/40 hover:bg-slate-800/60 border border-sky-500/20 text-xs text-sky-300 font-medium backdrop-blur-md transition-all"
        >
          <ArrowLeft size={14} />
          Back to Homepage
        </Link>
      </div>

      {/* Header with Official GSCSC Logo */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 flex flex-col items-center justify-center">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-300 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={12} className="text-sky-400" />
            <span>MEET OUR PEOPLE</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
          The Minds Behind GSCSC
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2">
          Distinguished faculty advisors, passionate student executives, and an active volunteer community driving scientific excellence.
        </p>
      </div>

      {/* Section 1: Faculty Leadership */}
      <div className="mb-14">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
          <GraduationCap className="text-sky-400" />
          Faculty Mentors &amp; Patronage
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {leadership.map((leader, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-5 sm:p-6 border border-sky-500/20 hover:border-sky-400/50 transition-all duration-300"
              style={{
                background: "rgba(6, 14, 34, 0.32)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(56,189,248,0.08)",
              }}
            >
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/25 text-sky-300 text-[11px] font-semibold uppercase tracking-wider mb-4">
                {leader.tag}
              </span>
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500/25 via-blue-600/30 to-cyan-400/20 border-2 border-sky-400/40 flex items-center justify-center text-sky-300 font-bold text-xl mb-4 shadow-[0_0_15px_rgba(56,189,248,0.25)]">
                {leader.name.charAt(0)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">{leader.name}</h3>
              <p className="text-sky-400 text-xs font-semibold mb-1">{leader.role}</p>
              <p className="text-slate-400 text-xs">{leader.dept}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Student Coordinators */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Users className="text-sky-400" />
          Executive Coordinators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {studentCoordinators.map((c, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-4 sm:p-5 border border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 text-center"
              style={{
                background: "rgba(6, 14, 34, 0.32)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(56,189,248,0.08)",
              }}
            >
              <div className="w-14 h-14 rounded-full mx-auto mb-3 bg-gradient-to-tr from-sky-500/25 via-blue-600/30 to-cyan-400/20 border-2 border-sky-400/40 flex items-center justify-center text-sky-300 font-bold text-lg shadow-[0_0_15px_rgba(56,189,248,0.25)]">
                {c.name.charAt(0)}
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{c.name}</h3>
              <p className="text-sky-400 text-xs font-semibold mb-2">{c.role}</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-200 text-[10px]">
                {c.wing}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
