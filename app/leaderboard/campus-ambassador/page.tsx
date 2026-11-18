import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Award, Sparkles, ArrowLeft } from "lucide-react";

export default function CampusAmbassadorLeaderboardPage() {
  const ambassadors = [
    { rank: 1, name: "Tanvir Ahmed", school: "Notre Dame College", points: 1420 },
    { rank: 2, name: "Samiul Hasan", school: "Dhaka College", points: 1250 },
    { rank: 3, name: "Nafis Fuad", school: "Residential Model College", points: 1180 },
    { rank: 4, name: "Abrar Zahin", school: "St. Joseph Higher Secondary School", points: 940 },
    { rank: 5, name: "Mahir Faisal", school: "RAJUK Uttara Model College", points: 890 },
  ];

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-24 px-3 sm:px-6 max-w-[900px] mx-auto">
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
            <span>AMBASSADOR PROGRAM</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
          Campus Ambassador Leaderboard
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2">
          Recognizing outstanding student leaders representing GSCSC in their respective institutions nationwide.
        </p>
      </div>

      <div
        className="rounded-3xl p-4 sm:p-8 border border-sky-500/20"
        style={{
          background: "rgba(6, 14, 34, 0.32)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(56,189,248,0.08)",
        }}
      >
        <div className="space-y-3">
          {ambassadors.map((ca) => (
            <div
              key={ca.rank}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-sky-500/15 hover:border-sky-400/40 transition-colors"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Round Blue Circle for Rank */}
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                    ca.rank === 1
                      ? "bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-[0_0_15px_rgba(56,189,248,0.5)] border border-sky-300"
                      : ca.rank === 2
                      ? "bg-slate-700 text-white border border-slate-500"
                      : ca.rank === 3
                      ? "bg-slate-800 text-slate-300 border border-slate-600"
                      : "bg-slate-900/60 text-slate-400 border border-white/10"
                  }`}
                >
                  #{ca.rank}
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    {ca.name}
                  </h3>
                  <p className="text-xs text-slate-400">{ca.school}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base sm:text-lg font-mono font-bold text-sky-400">
                  {ca.points.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
