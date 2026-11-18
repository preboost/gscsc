"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ExternalLink, Sparkles, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { EVENTS_DATA, ClubEvent, getStoredEvents, cleanIconText, fetchCloudEvents } from "@/lib/events-data";

export default function EventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>(EVENTS_DATA);

  useEffect(() => {
    const loadEvents = () => {
      setEvents(getStoredEvents());
    };
    loadEvents();

    // Pull from Cloudflare KV edge database so live updates from any browser appear
    fetchCloudEvents().then((cloudList) => {
      if (cloudList && Array.isArray(cloudList) && cloudList.length > 0) {
        setEvents(cloudList);
      }
    });

    window.addEventListener("gscsc_events_updated", loadEvents);
    window.addEventListener("storage", loadEvents);
    return () => {
      window.removeEventListener("gscsc_events_updated", loadEvents);
      window.removeEventListener("storage", loadEvents);
    };
  }, []);

  const upcomingEvents = events.filter((e) => e.is_upcoming !== false && e.is_active !== false);
  const pastEvents = events.filter((e) => e.is_upcoming === false || !e.is_upcoming);

  return (
    <main className="subpage-main min-h-screen relative z-10 px-3 sm:px-6 pb-24 max-w-[1150px] mx-auto">
      {/* Header */}
      <div className="pt-8 sm:pt-12 pb-10 sm:pb-14 text-center max-w-2xl mx-auto flex flex-col items-center justify-center">
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-950/40 backdrop-blur-md text-sky-300 text-xs font-semibold tracking-wide">
            <Calendar size={14} className="text-sky-400" />
            <span>FESTIVALS, WORKSHOPS &amp; COMPETITIONS</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Events &amp; <span className="text-shimmer">Festivals</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2">
          Explore upcoming national science carnivals, inter-college competitions, and hands-on laboratory workshops hosted by GSCSC.
        </p>
      </div>

      {/* ── Upcoming Events Section ── */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-cyan-500/20">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-cyan-400" />
              Upcoming Events &amp; Open Registrations
            </h2>
            <p className="text-slate-400 text-xs mt-1">Register today to secure your delegate pass</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
            {upcomingEvents.length} Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents.map((ev) => (
            <div
              key={ev.id}
              className="glass-card p-6 sm:p-8 flex flex-col justify-between border-cyan-400/30 hover:border-cyan-400/60 rounded-3xl group transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(8, 20, 48, 0.75) 0%, rgba(4, 10, 26, 0.85) 100%)",
              }}
            >
              <div>
                {/* 16:9 Image container (1920x1080 aspect ratio) */}
                {(ev.banner_url || (ev as any).image_url) && (
                  <Link href={`/events/${ev.id}`} className="block w-full aspect-[16/9] rounded-2xl overflow-hidden mb-5 relative border border-sky-500/20 bg-slate-950/60">
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
                )}

                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
                    <Clock size={13} />
                    Registration Open
                  </span>
                  <Link href={`/events/${ev.id}`} className="text-xs text-sky-400 hover:text-white flex items-center gap-1">
                    <span>Details &amp; Gallery</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                <Link href={`/events/${ev.id}`}>
                  <h3 className="text-xl font-bold text-white mb-3 hover:text-sky-300 transition-colors">{ev.title}</h3>
                </Link>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {ev.description}
                </p>

                <div className="space-y-2 text-xs text-slate-300 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-cyan-400 flex-shrink-0" />
                    <span>{cleanIconText(ev.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-cyan-400 flex-shrink-0" />
                    <span>{cleanIconText(ev.location)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-cyan-500/15 flex items-center gap-3">
                {ev.registration_link && (
                  <a
                    href={ev.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs flex-1 justify-center py-2.5"
                  >
                    <span>Register Now</span>
                    <ExternalLink size={13} />
                  </a>
                )}
                <Link
                  href={`/events/${ev.id}`}
                  className="btn-secondary text-xs flex-1 justify-center py-2.5"
                >
                  Event Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Past Festivals Section ── */}
      <div>
        <div className="mb-6 pb-3 border-b border-cyan-500/15">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="text-cyan-400" />
            Past Milestones &amp; Festivals
          </h2>
          <p className="text-slate-400 text-xs mt-1">Click any festival card to view event highlights, writeup, and full photo gallery</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastEvents.map((ev) => (
            <Link
              key={ev.id}
              href={`/events/${ev.id}`}
              className="glass-card p-6 rounded-3xl border-sky-500/20 hover:border-sky-400/50 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 block"
            >
              <div>
                {/* 16:9 Image container (1920x1080 aspect ratio) */}
                {(ev.banner_url || (ev as any).image_url) && (
                  <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-4 relative border border-sky-500/20 bg-slate-950/60">
                    <img
                      src={ev.banner_url || (ev as any).image_url || "/events/event-1.jpg"}
                      alt={ev.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/events/event-1.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 right-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-sky-300 text-[10px] font-bold border border-sky-400/30 flex items-center gap-1">
                        <span>View Gallery</span>
                        <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                )}
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-300 text-[0.68rem] font-bold uppercase mb-3 border border-sky-500/20">
                  {ev.category}
                </span>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                  {ev.title}
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-4">
                  {ev.description}
                </p>
              </div>

              <div className="pt-3 border-t border-sky-500/15 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-sky-400" />
                  {cleanIconText(ev.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-sky-400" />
                  {cleanIconText(ev.location)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
