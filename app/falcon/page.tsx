"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Rocket,
  Gauge,
  Compass,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Award,
  Sparkles,
  Camera
} from "lucide-react";
import { getStoredData, DEFAULT_FALCON, FalconData } from "@/lib/cmsData";
import {
  getStoredFalconFleet,
  getStoredFalconSlides,
  FalconRocket,
  FalconSlide,
  DEFAULT_FALCON_FLEET,
  DEFAULT_FALCON_SLIDES
} from "@/lib/falcon-data";

export default function FalconPage() {
  const [data, setData] = useState<FalconData>(DEFAULT_FALCON);
  const [fleet, setFleet] = useState<FalconRocket[]>(DEFAULT_FALCON_FLEET);
  const [slides, setSlides] = useState<FalconSlide[]>(DEFAULT_FALCON_SLIDES);

  useEffect(() => {
    setData(getStoredData("falcon", DEFAULT_FALCON));

    const loadFalconDynamic = () => {
      setFleet(getStoredFalconFleet());
      setSlides(getStoredFalconSlides());
    };
    loadFalconDynamic();
    window.addEventListener("gscsc_falcon_fleet_updated", loadFalconDynamic);
    window.addEventListener("gscsc_falcon_slides_updated", loadFalconDynamic);
    window.addEventListener("storage", loadFalconDynamic);
    return () => {
      window.removeEventListener("gscsc_falcon_fleet_updated", loadFalconDynamic);
      window.removeEventListener("gscsc_falcon_slides_updated", loadFalconDynamic);
      window.removeEventListener("storage", loadFalconDynamic);
    };
  }, []);

  return (
    <main className="subpage-main min-h-screen relative z-10 px-3 sm:px-6 pb-24 max-w-[1150px] mx-auto">
      {/* Hero */}
      <div className="pt-8 sm:pt-12 pb-10 sm:pb-14 text-center max-w-3xl mx-auto flex flex-col items-center justify-center">
        {/* Centered Official Falcon Insignia Logo */}
        <div className="flex justify-center mb-4 sm:mb-5 w-full">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 border-2 border-red-500/60 shadow-[0_0_35px_rgba(239,68,68,0.55)] bg-red-950/70 backdrop-blur-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/falcon-logo.jpg"
              alt="GSC Falcon Official Rocketry Emblem (ESTD-2024)"
              width={128}
              height={128}
              priority
              quality={100}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Badge on its own line below logo */}
        <div className="flex justify-center mb-4 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-950/40 backdrop-blur-md text-rose-300 text-xs font-semibold tracking-wide">
            <Rocket size={14} className="text-red-400" />
            <span>AEROSPACE &amp; ROCKETRY DIVISION</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4">
          <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent font-black drop-shadow-[0_0_30px_rgba(239,68,68,0.45)]">
            GSC Falcon
          </span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-base leading-relaxed px-2">
          {data.subtitle}
        </p>
      </div>

      {/* Mission Overview & Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Compass className="text-cyan-400" />
            Mission Blueprint
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {data.missionOverview}
          </p>
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200">
            <strong>Upcoming Target:</strong> {data.upcomingMission}
          </div>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Gauge className="text-cyan-400" />
            Engineering Specifications
          </h2>
          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-cyan-400 font-semibold block mb-0.5">Verified Apogee Record</span>
              <span className="text-white text-sm font-bold">{data.apogeeRecord}</span>
            </div>
            <div>
              <span className="text-cyan-400 font-semibold block mb-0.5">Propulsion Chemistry</span>
              <span className="text-slate-300">{data.propellantType}</span>
            </div>
            <div>
              <span className="text-cyan-400 font-semibold block mb-0.5">Telemetry &amp; Avionics</span>
              <span className="text-slate-300">{data.telemetrySpecs}</span>
            </div>
            <div>
              <span className="text-cyan-400 font-semibold block mb-0.5">Recovery Architecture</span>
              <span className="text-slate-300">{data.recoverySystem}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Fleet (Dynamic from getStoredFalconFleet) */}
      <div className="mb-14">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Rocket className="text-cyan-400" />
          The Falcon Flight Fleet
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fleet.map((r, idx) => (
            <div key={r.id || idx} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-cyan-400 text-xs font-bold">{r.year}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[0.68rem] font-semibold">
                    {r.apogee}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{r.name}</h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">{r.desc}</p>
              </div>

              <div>
                {r.propellant && (
                  <div className="text-[0.72rem] text-slate-400 mb-2">
                    <span className="text-cyan-300 font-medium">Propellant: </span>
                    {r.propellant}
                  </div>
                )}
                <div className="pt-3 border-t border-cyan-500/15 text-[0.72rem] text-slate-400">
                  <span className="text-cyan-300 font-medium">Status: </span>
                  {r.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="glass-card p-8 sm:p-12 text-center border-cyan-500/30 mb-14 sm:mb-16">
        <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
          Want to Build Sounding Rockets?
        </h3>
        <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
          GSC Falcon accepts intermediate college students every semester for hands-on CAD modeling, motor simulation, and live launch pad operations.
        </p>
        <Link href="/join-us" className="btn-primary">
          Join GSC Falcon Wing <ArrowRight size={15} />
        </Link>
      </div>

      {/* ── Pure Visual Marquee Gallery (Image Slider - Placed at the End - Zero Text) ── */}
      {slides.length > 0 && (
        <section className="overflow-hidden -mx-3 sm:-mx-6 pt-2">
          {/* Row 1: Sliding Left to Right (LTR) */}
          <div className="marquee-overflow mb-3 sm:mb-4">
            <div className="marquee-track-ltr">
              {[...slides, ...slides].map((s, idx) => (
                <div
                  key={`falcon-r1-${s.id || idx}-${idx}`}
                  className="flex-shrink-0 w-64 sm:w-80 md:w-[380px] aspect-[16/10] mr-3.5 sm:mr-5 rounded-2xl sm:rounded-3xl overflow-hidden border border-red-500/35 bg-slate-950 shadow-2xl hover:border-red-400 hover:scale-[1.02] transition-all duration-300 group"
                >
                  <img
                    src={s.image || "/events/event-2.jpg"}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/events/event-2.jpg";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Sliding Right to Left (RTL) */}
          <div className="marquee-overflow">
            <div className="marquee-track-rtl">
              {[...slides.slice(2), ...slides, ...slides.slice(0, 2)].map((s, idx) => (
                <div
                  key={`falcon-r2-${s.id || idx}-${idx}`}
                  className="flex-shrink-0 w-64 sm:w-80 md:w-[380px] aspect-[16/10] mr-3.5 sm:mr-5 rounded-2xl sm:rounded-3xl overflow-hidden border border-rose-500/35 bg-slate-950 shadow-2xl hover:border-rose-400 hover:scale-[1.02] transition-all duration-300 group"
                >
                  <img
                    src={s.image || "/events/event-1.jpg"}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/events/event-1.jpg";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
