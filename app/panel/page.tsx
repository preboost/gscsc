import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Award, Shield, ArrowRight, Sparkles } from "lucide-react";

export default function PanelPage() {
  const tiers = [
    {
      title: "Executive Committee",
      href: "/panel/executive",
      desc: "The core student leadership governing the club's strategy, annual budget, flagship festival logistics, and departmental administration.",
      count: "15 Members",
      icon: Shield,
    },
    {
      title: "Club Moderators",
      href: "/moderators",
      desc: "Distinguished faculty advisors from Govt. Science College counseling student research, academic initiatives, and club governance.",
      count: "4 Faculty Mentors",
      icon: Users,
    },
    {
      title: "Ex-Panelists & Alumni",
      href: "/panel/ex-panelist",
      desc: "Esteemed past leaders and alumni across world-class universities, aerospace centers, tech companies, and research institutions.",
      count: "500+ Alumni",
      icon: Award,
    },
  ];

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-24 px-3 sm:px-6 max-w-[1150px] mx-auto">
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
            <span>GOVERNANCE &amp; LEADERSHIP</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
          Our <span className="text-shimmer">Executives</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2">
          The guiding force driving Govt. Science College Science Club toward pioneering scientific heights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {tiers.map((tier, idx) => {
          const Icon = tier.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl p-6 sm:p-8 border border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 flex flex-col justify-between"
              style={{
                background: "rgba(6, 14, 34, 0.32)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(56,189,248,0.08)",
              }}
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-blue-600/30 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-6 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                  <Icon size={24} />
                </div>
                <span className="text-sky-400 text-xs font-mono font-bold tracking-wider uppercase block mb-1">
                  {tier.count}
                </span>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                  {tier.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {tier.desc}
                </p>
              </div>

              <Link
                href={tier.href}
                className="inline-flex items-center justify-between w-full px-5 py-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-sky-300 font-bold text-xs transition-all group"
              >
                <span>View Panelists</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
