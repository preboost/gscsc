"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Rocket, Cpu, Award, Globe, Camera, BookOpen, Sparkles,
  ArrowRight, CheckCircle2, Calendar, MapPin, Users, Compass, FileText,
  Megaphone, FlaskConical, Star, Trophy, ExternalLink, Quote, ChevronRight, ChevronLeft, Layers
} from "lucide-react";
import { getStoredData, DEFAULT_ABOUT, AboutData } from "@/lib/cmsData";
import { getStoredEvents, ClubEvent, EVENTS_DATA, cleanIconText, fetchCloudEvents } from "@/lib/events-data";
import { getStoredSlidePics, SlidePicItem, DEFAULT_SLIDE_PICS } from "@/lib/slide-pics-data";
import { getStoredDepartments, fetchCloudDepartments, DepartmentItem, DEFAULT_DEPARTMENTS } from "@/lib/departments-data";

function getWingIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("rocket") || t.includes("aerospace")) return Rocket;
  if (t.includes("olympiad")) return Star;
  if (t.includes("research") || t.includes("project")) return FileText;
  if (t.includes("it") || t.includes("tech") || t.includes("programming") || t.includes("computer")) return Cpu;
  if (t.includes("quiz")) return Award;
  if (t.includes("photo") || t.includes("media") || t.includes("video")) return Camera;
  if (t.includes("press") || t.includes("publication")) return Megaphone;
  if (t.includes("science") || t.includes("affair") || t.includes("carnival")) return FlaskConical;
  if (t.includes("magazine") || t.includes("scrapbook") || t.includes("book")) return BookOpen;
  if (t.includes("public") || t.includes("relation") || t.includes("pr") || t.includes("outreach")) return Globe;
  return Layers;
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1600;
        const steps = 60;
        const inc = target / steps;
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + inc, target);
          setCount(Math.floor(cur));
          if (cur >= target) clearInterval(t);
        }, duration / steps);
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { label: "Curious Minds", value: 1500, suffix: "+" },
  { label: "Years of Legacy", value: 44, suffix: "" },
  { label: "Partner Institutions", value: 120, suffix: "+" },
  { label: "Annual Events", value: 18, suffix: "+" },
];

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [about, setAbout] = useState<AboutData>(DEFAULT_ABOUT);
  const [eventsList, setEventsList] = useState<ClubEvent[]>(EVENTS_DATA);
  const [slidePics, setSlidePics] = useState<SlidePicItem[]>(DEFAULT_SLIDE_PICS);
  const [departmentsList, setDepartmentsList] = useState<DepartmentItem[]>(DEFAULT_DEPARTMENTS);

  useEffect(() => {
    setAbout(getStoredData("about", DEFAULT_ABOUT));

    const loadData = () => {
      setEventsList(getStoredEvents());
      setSlidePics(getStoredSlidePics());
      setDepartmentsList(getStoredDepartments());
    };
    loadData();

    // Fetch live from Cloudflare KV edge so any events or wings added by admin show immediately on all devices
    fetchCloudEvents().then((cloudList) => {
      if (cloudList && Array.isArray(cloudList) && cloudList.length > 0) {
        setEventsList(cloudList);
      }
    });
    fetchCloudDepartments().then((cloudDepts) => {
      if (cloudDepts && Array.isArray(cloudDepts) && cloudDepts.length > 0) {
        setDepartmentsList(cloudDepts);
      }
    });

    window.addEventListener("gscsc_events_updated", loadData);
    window.addEventListener("gscsc_slide_pics_updated", loadData);
    window.addEventListener("gscsc_departments_updated", loadData);
    window.addEventListener("storage", loadData);
    return () => {
      window.removeEventListener("gscsc_events_updated", loadData);
      window.removeEventListener("gscsc_slide_pics_updated", loadData);
      window.removeEventListener("gscsc_departments_updated", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setJoined(true);
    setTimeout(() => {
      setEmail("");
      setJoined(false);
    }, 4000);
  };

  return (
    <div className="relative w-full">
      {/* ── Responsive Hero Section ── */}
      <section className="relative z-10 min-h-[75vh] sm:min-h-[85vh] flex flex-col items-center justify-center text-center pt-20 sm:pt-24 pb-8 sm:pb-14 px-3 sm:px-6">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full">
          {/* Hero Official Logo */}
          <div className="mb-4 sm:mb-5">
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1.5 sm:p-2 border-2 border-sky-400/60 shadow-[0_0_35px_rgba(56,189,248,0.5)] bg-slate-950/70 backdrop-blur-xl mx-auto flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="GSCSC Official Logo"
                width={128}
                height={128}
                priority
                quality={100}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-sky-400/40 bg-sky-950/25 backdrop-blur-md text-sky-300 text-[10px] sm:text-xs font-semibold tracking-wide mb-3 sm:mb-5 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
            <Sparkles size={13} className="text-sky-400" />
            <span>ESTABLISHED IN {about.establishedYear} &bull; OVER 1,500 MINDS UNITED</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-3 sm:mb-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            Govt. Science College <br />
            <span className="text-shimmer">Science Club.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed mb-5 sm:mb-8 drop-shadow-lg px-2">
            Where curiosity meets innovation since {about.establishedYear}. Connecting student researchers, rocketeers, and olympiad champions to explore the frontiers of human knowledge.
          </p>

          {/* Elongated Gmail-style Bar with previous button */}
          <div className="w-full max-w-md mx-auto mt-1 sm:mt-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmed = email.trim();
                if (trimmed) {
                  try {
                    localStorage.setItem("gscsc_prefill_email", trimmed);
                    sessionStorage.setItem("gscsc_prefill_email", trimmed);
                  } catch {}
                  window.location.href = `/join-us?email=${encodeURIComponent(trimmed)}`;
                } else {
                  window.location.href = "/join-us";
                }
              }}
              className="email-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent border-none outline-none text-white text-xs sm:text-sm px-4 py-2 placeholder-slate-300"
              />
              <button type="submit" className="btn-primary flex-shrink-0">
                <span>Join Now</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

          {/* Meta Tags */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-200/90 drop-shadow">
            <span className="flex items-center gap-1.5">
              <Users size={13} className="text-cyan-400" /> Est. {about.establishedYear}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Globe size={13} className="text-cyan-400" /> Tejgaon, Dhaka
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Award size={13} className="text-cyan-400" /> National Champions
            </span>
          </div>
        </div>
      </section>

      {/* ── Transparent Stats Section ── */}
      <section
        className="relative z-20 py-8 sm:py-12 px-3 sm:px-4"
        style={{
          background: "rgba(5, 11, 28, 0.62)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          borderTop: "1px solid rgba(56, 189, 248, 0.22)",
          borderBottom: "1px solid rgba(56, 189, 248, 0.22)",
        }}
      >
        <div className="max-w-[1150px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="stat-number">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-slate-300 text-[10px] sm:text-xs mt-1 uppercase tracking-widest font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Transparent Project GSC Falcon Highlight Banner ── */}
      <section className="relative z-20 py-8 sm:py-16 px-3 sm:px-6 max-w-[1150px] mx-auto">
        <div
          className="rounded-3xl p-6 sm:p-12 border border-cyan-400/35 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(6, 16, 42, 0.72) 0%, rgba(3, 8, 22, 0.8) 100%)",
            backdropFilter: "blur(36px)",
            WebkitBackdropFilter: "blur(36px)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(56, 189, 248, 0.15)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/35 text-rose-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 backdrop-blur-md">
                <Rocket size={14} className="text-red-400" />
                Featured Aerospace Initiative
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-2 sm:mb-3">
                <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent font-black drop-shadow-[0_0_25px_rgba(239,68,68,0.4)]">
                  GSC Falcon
                </span>
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                Bangladesh&apos;s pioneering student-led atmospheric sounding rocket program. Engineering custom solid-propellant motors, telemetry avionics, and high-altitude research probes reaching over 1.24 km apogee.
              </p>
              <div className="flex flex-wrap gap-2.5 sm:gap-4 text-xs text-cyan-200">
                <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 backdrop-blur-md">
                  <span className="text-slate-300 block text-[0.65rem] sm:text-[0.68rem]">Apogee Record</span>
                  <span className="font-bold text-white text-xs sm:text-sm">1.24 Kilometers</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 backdrop-blur-md">
                  <span className="text-slate-300 block text-[0.65rem] sm:text-[0.68rem]">Telemetry</span>
                  <span className="font-bold text-white text-xs sm:text-sm">915 MHz RF Link</span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 backdrop-blur-md">
                  <span className="text-slate-300 block text-[0.65rem] sm:text-[0.68rem]">Current Mission</span>
                  <span className="font-bold text-white text-xs sm:text-sm">Falcon-III Probe</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 sm:gap-3 flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
              <Link href="/falcon" className="btn-primary text-center justify-center">
                <span>Explore Falcon Wing</span>
                <ArrowRight size={15} />
              </Link>
              <Link href="/projects" className="btn-secondary text-center justify-center">
                All Research Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Transparent Dynamic Departments 2-Tier Marquee ── */}
      <section className="relative z-20 py-8 sm:py-16 overflow-hidden">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 px-4">
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest block mb-1 sm:mb-2">Specialized Wings</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight">
            {departmentsList.length} Specialized Wings. <span className="text-cyan-400">One Mission.</span>
          </h2>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto mb-4 sm:mb-6">
            From research and rocketry to Olympiads and information technology, our wings offer students a focused platform to excel.
          </p>
          <div>
            <Link
              href="/departments"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 hover:from-sky-400 hover:to-blue-500 shadow-[0_0_20px_rgba(56,189,248,0.4)] border border-sky-300/30 transition-all transform hover:scale-105"
            >
              <span>Discover Where You Belong</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Row 1: LTR */}
        <div className="marquee-overflow mb-4">
          <div className="marquee-track-ltr">
            {[...departmentsList, ...departmentsList].map((dept, idx) => {
              const Icon = getWingIcon(dept.title);
              return (
                <div key={idx} className="marquee-card">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-3">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{dept.title}</h3>
                  <p className="text-slate-300 text-[0.72rem] leading-relaxed mb-3">{dept.desc}</p>
                  {dept.activities && dept.activities.length > 0 && (
                    <ul className="space-y-1">
                      {dept.activities.slice(0, 3).map((k, ki) => (
                        <li key={ki} className="text-[0.68rem] text-cyan-200 flex items-start gap-1.5">
                          <span className="text-cyan-400">▸</span>{k}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2: RTL */}
        <div className="marquee-overflow">
          <div className="marquee-track-rtl">
            {[...departmentsList.slice(Math.floor(departmentsList.length / 2)), ...departmentsList, ...departmentsList.slice(0, Math.floor(departmentsList.length / 2))].map((dept, idx) => {
              const Icon = getWingIcon(dept.title);
              return (
                <div key={idx} className="marquee-card">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-3">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{dept.title}</h3>
                  <p className="text-slate-300 text-[0.72rem] leading-relaxed">{dept.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-10 px-4">
          <Link href="/departments" className="btn-secondary text-xs">
            <span>Explore All {departmentsList.length} Specialized Wings</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Transparent Founder's Tribute Spotlight ── */}
      <section className="relative z-20 py-16 px-4 sm:px-6 max-w-[1150px] mx-auto border-t border-cyan-500/15">
        <div className="glass-card p-8 sm:p-12 border-cyan-500/30">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-cyan-400/40 p-1 shadow-[0_0_30px_rgba(56,189,248,0.3)] bg-slate-900 mx-auto relative flex-shrink-0">
              <img
                src={about.founderPhoto || "/founder-santosh-kumar-roy.jpg"}
                alt={about.founderName || "Founding Patron Prof. Santosh Kumar Roy"}
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/founder-santosh-kumar-roy.jpg";
                }}
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/35 text-cyan-300 text-[0.7rem] font-bold uppercase mb-2 backdrop-blur-md">
                Founder&apos;s Tribute &bull; Est. {about.establishedYear}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">{about.founderName}</h2>
              <p className="text-cyan-400 text-xs font-semibold mb-3">{about.founderTitle}</p>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-4">
                {about.founderBio}
              </p>
              <div className="p-3.5 rounded-xl bg-cyan-950/25 border border-cyan-500/25 text-xs text-slate-200 italic backdrop-blur-md">
                &ldquo;{about.founderQuote}&rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Transparent Upcoming Events & Registration Section ── */}
      <section className="relative z-20 py-16 px-4 sm:px-6 max-w-[1150px] mx-auto border-t border-cyan-500/15">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest block mb-1">
              Active Competitions
            </span>
            <h2 className="text-3xl font-black text-white">Upcoming Events &amp; Festivals</h2>
          </div>
          <Link href="/events" className="text-cyan-400 text-xs font-bold hover:underline flex items-center gap-1">
            View All Events &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventsList.filter((e) => e.is_upcoming !== false && e.is_active !== false).slice(0, 4).map((ev) => (
            <div
              key={ev.id}
              className="glass-card p-6 sm:p-8 flex flex-col justify-between border-cyan-400/35 hover:border-cyan-400/60 rounded-3xl transition-all"
            >
              <div>
                {/* 16:9 Banner */}
                <Link
                  href={`/events/${ev.id}`}
                  className="block w-full aspect-[16/9] rounded-2xl overflow-hidden mb-4 relative border border-sky-500/20 bg-slate-950/60 group"
                >
                  <img
                    src={ev.banner_url || (ev as any).image_url || "/events/event-1.jpg"}
                    alt={ev.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/events/event-1.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                      {ev.category || "Upcoming"}
                    </span>
                  </div>
                </Link>

                <h3 className="text-xl font-bold text-white mb-2">{ev.title}</h3>
                <p className="text-slate-200 text-xs leading-relaxed mb-4">
                  {ev.description}
                </p>
                <div className="text-xs text-slate-300 space-y-2 mb-6">
                  {ev.date && (
                    <div className="flex items-center gap-2 text-sky-300 font-medium">
                      <Calendar size={14} className="text-sky-400 shrink-0" />
                      <span>{cleanIconText(ev.date)}</span>
                    </div>
                  )}
                  {ev.location && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin size={14} className="text-rose-400 shrink-0" />
                      <span>{cleanIconText(ev.location)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-cyan-500/15">
                {ev.registration_link && (
                  <a
                    href={ev.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs flex-1 justify-center py-2.5"
                  >
                    <span>Register Now (Open)</span>
                    <ExternalLink size={13} />
                  </a>
                )}
                <Link
                  href={`/events/${ev.id}`}
                  className="btn-secondary text-xs flex-1 justify-center py-2.5"
                >
                  <span>Details &rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pure Visual Marquee Gallery (Just Row Pics Sliding Left & Right - Zero Text) ── */}
      <section className="relative z-20 py-8 sm:py-14 overflow-hidden border-t border-cyan-500/15">
        {/* Row 1: Sliding Left to Right (LTR) */}
        <div className="marquee-overflow mb-4 sm:mb-5">
          <div className="marquee-track-ltr">
            {[...slidePics, ...slidePics].map((pic, idx) => (
              <div
                key={`slide-r1-${pic.id}-${idx}`}
                className="flex-shrink-0 w-64 sm:w-80 md:w-[380px] aspect-[16/10] mr-3.5 sm:mr-5 rounded-2xl sm:rounded-3xl overflow-hidden border border-sky-400/30 bg-slate-950 shadow-2xl hover:border-sky-300 hover:scale-[1.02] transition-all duration-300 group"
              >
                <img
                  src={pic.image || "/events/event-1.jpg"}
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

        {/* Row 2: Sliding Right to Left (RTL) */}
        <div className="marquee-overflow">
          <div className="marquee-track-rtl">
            {[...slidePics.slice(2), ...slidePics, ...slidePics.slice(0, 2)].map((pic, idx) => (
              <div
                key={`slide-r2-${pic.id}-${idx}`}
                className="flex-shrink-0 w-64 sm:w-80 md:w-[380px] aspect-[16/10] mr-3.5 sm:mr-5 rounded-2xl sm:rounded-3xl overflow-hidden border border-cyan-400/30 bg-slate-950 shadow-2xl hover:border-cyan-300 hover:scale-[1.02] transition-all duration-300 group"
              >
                <img
                  src={pic.image || "/events/event-2.jpg"}
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
      </section>

      {/* ── Final Call to Action ── */}
      <section className="relative z-20 py-20 px-4 sm:px-6 max-w-[1150px] mx-auto mb-10">
        <div
          className="rounded-3xl p-6 sm:p-14 text-center border border-cyan-400/35 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(6, 18, 48, 0.72) 0%, rgba(3, 8, 24, 0.82) 100%)",
            backdropFilter: "blur(36px)",
            WebkitBackdropFilter: "blur(36px)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 50px rgba(56, 189, 248, 0.18)",
          }}
        >
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Ready to explore <br />
            <span className="text-shimmer">the universe?</span>
          </h2>
          <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Join Govt. Science College Science Club and turn your curiosity into world-changing innovation. Applications open every semester.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/join-us" className="btn-primary text-sm w-full sm:w-auto justify-center">
              Join the Club Today
            </Link>
            <Link href="/contact" className="btn-secondary text-sm w-full sm:w-auto justify-center">
              Contact Organizing Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
