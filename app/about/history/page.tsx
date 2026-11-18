import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Award, Landmark, Sparkles, ArrowLeft } from "lucide-react";

export default function HistoryPage() {
  const milestones = [
    {
      year: "1981 - 1991",
      title: "Founding of the Club",
      desc: "Originated as a passionate student-led scientific discussion forum at Govt. Science College, Tejgaon, Dhaka, exploring natural sciences and amateur astronomy.",
      icon: Landmark,
    },
    {
      year: "1991 - 2005",
      title: "Formalization & Expansion",
      desc: "Officially formalized as Govt. Science College Science Club (GSCSC). Hosted the first intra-college science exhibition and published inaugural periodicals.",
      icon: Clock,
    },
    {
      year: "2005 - 2020",
      title: "Birth of Flagship National Festivals",
      desc: "Expanded into nationwide carnivals hosting over 100+ schools and colleges annually. Pioneered robotics leagues and olympiad circuits in Dhaka.",
      icon: Award,
    },
    {
      year: "2020 - Present",
      title: "Modern Tech & Project GSC Falcon",
      desc: "Establishing advanced wings in Model Rocketry, Atmospheric Science, and Artificial Intelligence, inspiring over 1,500+ members every session.",
      icon: Sparkles,
    },
  ];

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-24 px-3 sm:px-6 max-w-[1150px] mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/about"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/40 hover:bg-slate-800/60 border border-sky-500/20 text-xs text-sky-300 font-medium backdrop-blur-md transition-all"
        >
          <ArrowLeft size={14} />
          Back to About
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
            <span>HERITAGE &amp; LEGACY SINCE 1981</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
          44 Years of Scientific Excellence
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2">
          Tracing the journey of how a small circle of enthusiastic thinkers evolved into Bangladesh&apos;s premier student science club.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
        {milestones.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl p-5 sm:p-8 border border-sky-500/20 hover:border-sky-400/50 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start transition-all"
              style={{
                background: "rgba(6, 14, 34, 0.32)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(56,189,248,0.08)",
              }}
            >
              {/* Round Blue Circle Icon */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-blue-600/30 border border-sky-400/30 flex items-center justify-center text-sky-400 flex-shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                <Icon size={22} />
              </div>
              <div>
                <span className="text-sky-400 text-xs font-mono font-bold uppercase tracking-wider block mb-1">
                  {m.year}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight">
                  {m.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
