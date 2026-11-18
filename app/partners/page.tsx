"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, Handshake, Globe, ExternalLink, ShieldCheck, Mail, ArrowRight } from "lucide-react";

interface Partner {
  id: number;
  name: string;
  type?: string;
  website?: string;
  description?: string;
  logo_url?: string;
  is_active?: boolean;
}

const DEFAULT_PARTNERS: Partner[] = [
  {
    id: 1,
    name: "Bangladesh Science Society (BSS)",
    type: "Academic Partner",
    website: "https://bss.org.bd",
    description: "National science promotion body collaborating on countrywide science fairs and olympiad mentoring.",
    is_active: true,
  },
  {
    id: 2,
    name: "BUET Science Club",
    type: "Club Partner",
    website: "https://buet.ac.bd",
    description: "Inter-collegiate academic collaboration for high-level robotics, physics olympiad training, and hackathons.",
    is_active: true,
  },
  {
    id: 3,
    name: "Dhaka Regional Science Fair",
    type: "Event Sponsor & Partner",
    website: "",
    description: "Annual co-organizer and festival partner for regional talent hunt competitions and STEM exhibitions.",
    is_active: true,
  },
  {
    id: 4,
    name: "Bangladesh Astronomical Association",
    type: "Research & Workshop Partner",
    website: "https://astronomy.org.bd",
    description: "Stargazing camps, telescope building sessions, and deep-space observation workshops.",
    is_active: true,
  },
  {
    id: 5,
    name: "Govt. Science College Alumni Association",
    type: "Endowment Partner",
    website: "",
    description: "Supporting research projects, Falcon rocketry flight trials, and student scholarship grants.",
    is_active: true,
  },
];

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(DEFAULT_PARTNERS);

  useEffect(() => {
    function loadPartners() {
      try {
        const stored = localStorage.getItem("gscsc_club_partners");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPartners(parsed);
            return;
          }
        }
      } catch {
        // fallback
      }
      setPartners(DEFAULT_PARTNERS);
    }

    loadPartners();
    window.addEventListener("gscsc_club_partners_updated", loadPartners);
    window.addEventListener("storage", loadPartners);
    return () => {
      window.removeEventListener("gscsc_club_partners_updated", loadPartners);
      window.removeEventListener("storage", loadPartners);
    };
  }, []);

  return (
    <main className="subpage-main min-h-screen pt-8 sm:pt-12 pb-24 px-3 sm:px-6 max-w-[1200px] mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/50 hover:bg-slate-800/70 border border-sky-500/20 text-xs text-sky-300 font-medium backdrop-blur-md transition-all"
        >
          <ArrowLeft size={14} />
          Back to Homepage
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 flex flex-col items-center justify-center">
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
            <span>INSTITUTIONAL COLLABORATIONS &amp; SPONSORS</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Club <span className="text-shimmer">Partners</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2 max-w-2xl">
          Empowering future scientists through strategic alliances with leading universities, scientific societies, technology innovators, and community champions across Bangladesh.
        </p>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-16">
        {partners.map((p) => (
          <div
            key={p.id}
            className="rounded-3xl p-6 border border-sky-500/20 hover:border-sky-400/50 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group shadow-xl"
            style={{
              background: "linear-gradient(155deg, rgba(6, 16, 42, 0.7) 0%, rgba(3, 8, 24, 0.85) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div>
              {/* Top Badge & Icon */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[10px] font-mono font-bold tracking-wide">
                  {p.type || "Official Partner"}
                </span>
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                  <Handshake size={18} />
                </div>
              </div>

              {/* Partner Name */}
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-sky-300 transition-colors">
                {p.name}
              </h3>

              {/* Description */}
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                {p.description || "Active institutional supporter of GSCSC youth STEM initiatives, competitions, and research workshops."}
              </p>
            </div>

            {/* Footer / Website Link */}
            <div className="pt-4 border-t border-sky-500/15 flex items-center justify-between">
              {p.website ? (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-sky-300 font-semibold hover:text-white transition-colors"
                >
                  <Globe size={13} className="text-sky-400" />
                  <span>Visit Organization</span>
                  <ExternalLink size={11} />
                </a>
              ) : (
                <span className="text-[11px] text-slate-500 font-mono">
                  Affiliated Partner
                </span>
              )}

              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <ShieldCheck size={12} />
                <span>Verified</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Become a Partner Call to Action Card */}
      <div
        className="rounded-3xl p-8 sm:p-12 border border-sky-400/30 text-center relative overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(8, 25, 65, 0.85) 0%, rgba(3, 9, 28, 0.95) 100%)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center mx-auto mb-4 text-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.35)]">
            <Handshake size={28} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
            Collaborate With GSCSC
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Are you an organization, tech enterprise, or educational institute looking to inspire the next generation of innovators? Partner with us on nationwide science festivals, workshops, and aerospace initiatives.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Mail size={16} />
            <span>Inquire About Partnership</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
