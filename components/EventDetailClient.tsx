"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Sparkles,
  Clock,
  CheckCircle2,
  Award,
  ExternalLink,
  Layers,
  Camera
} from "lucide-react";
import { ClubEvent, cleanIconText, fetchCloudEvents } from "@/lib/events-data";

interface EventDetailClientProps {
  initialEvent: ClubEvent;
  eventId: string;
}

export default function EventDetailClient({
  initialEvent,
  eventId,
}: EventDetailClientProps) {
  const [event, setEvent] = useState<ClubEvent>(initialEvent);

  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const stored = localStorage.getItem("gscsc_events");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const found = parsed.find(
              (e: any) => e.id.toString() === eventId
            );
            if (found) {
              setEvent((prev) => ({
                ...prev,
                title: found.title || prev.title,
                subtitle: found.subtitle !== undefined ? found.subtitle : prev.subtitle,
                description: found.description !== undefined ? found.description : prev.description,
                date: found.date || prev.date,
                location: found.location || prev.location,
                category: found.category || prev.category,
                is_active: found.is_active !== undefined ? found.is_active : prev.is_active,
                is_upcoming: found.is_upcoming !== undefined ? found.is_upcoming : prev.is_upcoming,
                registration_link:
                  found.registration_link !== undefined ? found.registration_link : prev.registration_link,
                banner_url: found.banner_url || found.image_url || prev.banner_url,
                full_story:
                  found.full_story && Array.isArray(found.full_story) && found.full_story.length > 0
                    ? found.full_story
                    : found.description
                    ? [found.description]
                    : prev.full_story,
              }));
            }
          }
        }
      } catch (err) {
        console.error("Error reading stored events", err);
      }
    };

    syncFromStorage();

    // Pull directly from cloud edge KV in case it's a newly created event or viewed from another device
    fetchCloudEvents().then((cloudList) => {
      if (cloudList && Array.isArray(cloudList)) {
        const found = cloudList.find((e: any) => e.id.toString() === eventId);
        if (found) {
          setEvent(found);
        }
      }
    });

    window.addEventListener("gscsc_events_updated", syncFromStorage);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      window.removeEventListener("gscsc_events_updated", syncFromStorage);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [eventId]);

  const bannerImg = event.banner_url || (event as any).image_url;

  return (
    <main className="subpage-main min-h-screen relative z-10 px-3 sm:px-6 pb-24 max-w-[1150px] mx-auto">
      {/* ── Top Breadcrumb Navigation ── */}
      <div className="pt-6 sm:pt-10 mb-6 flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-sky-500/25 text-xs text-sky-300 font-medium backdrop-blur-md transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Events</span>
        </Link>
      </div>

      {/* ── Giant 16:9 Banner (1920x1080 ratio) ── */}
      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border-2 border-sky-400/40 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(56,189,248,0.25)] mb-8 bg-slate-950 group">
        <img
          src={bannerImg || "/events/event-1.jpg"}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/events/event-1.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Floating badge inside banner */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-sky-400/40 text-sky-300 text-xs font-bold uppercase tracking-wider shadow-lg">
            {event.category}
          </span>
          {event.is_upcoming ? (
            <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/80 backdrop-blur-md text-white text-xs font-bold tracking-wide shadow-lg flex items-center gap-1.5">
              <Clock size={13} />
              <span>Registration Open</span>
            </span>
          ) : (
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/80 backdrop-blur-md text-white text-xs font-bold tracking-wide shadow-lg flex items-center gap-1.5">
              <CheckCircle2 size={13} />
              <span>Completed Milestone</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Event Details & Meta Header ── */}
      <div className="rounded-3xl p-6 sm:p-10 border border-sky-500/25 bg-slate-950/60 backdrop-blur-2xl shadow-2xl mb-12">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold uppercase">
            {event.category}
          </span>
          {event.duration && (
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
              {event.duration}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          {event.title}
        </h1>

        {event.subtitle && (
          <p className="text-sky-300 text-sm sm:text-base font-semibold mb-6">
            {event.subtitle}
          </p>
        )}

        {/* Date & Location Pills */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300 pt-4 border-t border-sky-500/20 mb-8">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-sky-400 flex-shrink-0" />
            <span>{cleanIconText(event.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-sky-400 flex-shrink-0" />
            <span>{cleanIconText(event.location)}</span>
          </div>
        </div>

        {/* CTA Button if registration is open */}
        {event.registration_link && (
          <div className="mb-8">
            <a
              href={event.registration_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-bold shadow-[0_0_25px_rgba(56,189,248,0.35)]"
            >
              <span>Register for Event</span>
              <ExternalLink size={15} />
            </a>
          </div>
        )}

        {/* Detailed Story / Writeup */}
        <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-sky-500/15 pt-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-sky-400" />
            <span>Event Overview &amp; Highlights</span>
          </h2>
          {event.full_story && event.full_story.length > 0 ? (
            event.full_story.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))
          ) : (
            <p>{event.description}</p>
          )}
        </div>

        {/* Event Segments */}
        {event.segments && event.segments.length > 0 && (
          <div className="mt-8 pt-6 border-t border-sky-500/15">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-sky-400 mb-4 flex items-center gap-2">
              <Layers size={16} />
              <span>Competitive Segments &amp; Divisions</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {event.segments.map((seg, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-sky-950/40 border border-sky-500/20 text-xs text-slate-200"
                >
                  <Award size={14} className="text-sky-400 flex-shrink-0" />
                  <span>{seg}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Photo Gallery Section ── */}
      {event.gallery && event.gallery.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-sky-500/20">
            <div className="flex items-center gap-2.5">
              <Camera className="text-sky-400 w-5 h-5" />
              <div>
                <h2 className="text-xl font-bold text-white">Event Photo Gallery</h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Capturing moments of innovation, competition, and victory
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold">
              {event.gallery.length} Photos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {event.gallery.map((photo, idx) => (
              <div
                key={idx}
                className="glass-card p-3 rounded-3xl border-sky-500/25 hover:border-sky-400/60 transition-all duration-300 group overflow-hidden shadow-xl"
              >
                <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden relative border border-sky-500/20 bg-slate-950/80 mb-3">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-slate-300 px-2 py-1 leading-relaxed">
                  {photo.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
