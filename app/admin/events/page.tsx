"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  ExternalLink,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  AlertCircle,
  Clock,
  MapPin,
  Eye,
  CheckCircle2
} from "lucide-react";
import { compressImageFile, normalizeImageUrl } from "@/lib/imageUtils";
import { EVENTS_DATA, ClubEvent, getStoredEvents, saveStoredEvents, cleanIconText, fetchCloudEvents, syncEventsToCloud } from "@/lib/events-data";

interface EventFormData {
  title: string;
  subtitle: string;
  category: string;
  date: string;
  duration: string;
  location: string;
  banner_url: string;
  is_upcoming: boolean;
  is_active: boolean;
  registration_link: string;
  description: string;
  full_story_text: string;
  segments_text: string;
}

const BLANK_FORM: EventFormData = {
  title: "",
  subtitle: "",
  category: "Upcoming Event",
  date: "",
  duration: "1-Day Program",
  location: "Govt. Science College Campus, Tejgaon, Dhaka",
  banner_url: "/events/event-1.jpg",
  is_upcoming: true,
  is_active: true,
  registration_link: "",
  description: "",
  full_story_text: "",
  segments_text: "",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ClubEvent[]>(EVENTS_DATA);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EventFormData>({ ...BLANK_FORM });
  const [editId, setEditId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Hidden file inputs
  const formFileInputRef = useRef<HTMLInputElement>(null);
  const quickUploadInputRef = useRef<HTMLInputElement>(null);
  const [quickUploadTargetId, setQuickUploadTargetId] = useState<number | null>(null);

  useEffect(() => {
    const syncEvents = () => {
      setEvents(getStoredEvents());
    };
    syncEvents();

    // Sync from Cloudflare KV edge database
    fetchCloudEvents().then((cloudList) => {
      if (cloudList && Array.isArray(cloudList) && cloudList.length > 0) {
        setEvents(cloudList);
      }
    });

    window.addEventListener("gscsc_events_updated", syncEvents);
    window.addEventListener("storage", syncEvents);
    return () => {
      window.removeEventListener("gscsc_events_updated", syncEvents);
      window.removeEventListener("storage", syncEvents);
    };
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImageError(null);

    try {
      const compressedDataUri = await compressImageFile(file, 960, 540);
      setForm((prev) => ({
        ...prev,
        banner_url: compressedDataUri,
      }));
    } catch (err) {
      setImageError((err as Error).message || "Failed to process image file.");
    } finally {
      setUploadingImage(false);
      if (formFileInputRef.current) {
        formFileInputRef.current.value = "";
      }
    }
  };

  const handleQuickUploadSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || quickUploadTargetId === null) return;

    try {
      const compressedDataUri = await compressImageFile(file, 960, 540);
      const currentList = getStoredEvents();
      const updated = currentList.map((ev) =>
        ev.id === quickUploadTargetId
          ? { ...ev, banner_url: compressedDataUri, image_url: compressedDataUri }
          : ev
      );
      setEvents(updated);
      saveStoredEvents(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Failed to process image: " + (err as Error).message);
    } finally {
      setQuickUploadTargetId(null);
      if (quickUploadInputRef.current) {
        quickUploadInputRef.current.value = "";
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Please enter an event title.");
      return;
    }

    const storyParagraphs = form.full_story_text
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const segmentsList = form.segments_text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const banner = form.banner_url || "/events/event-1.jpg";
    const currentList = getStoredEvents();
    let updated: ClubEvent[];

    if (editId !== null) {
      updated = currentList.map((ev) =>
        ev.id === editId
          ? {
              ...ev,
              title: form.title.trim(),
              subtitle: form.subtitle.trim() || undefined,
              category: form.category.trim() || "Event",
              date: cleanIconText(form.date) || "Scheduled Date",
              duration: form.duration.trim() || undefined,
              location: cleanIconText(form.location) || "Govt. Science College, Dhaka",
              banner_url: banner,
              image_url: banner,
              is_upcoming: form.is_upcoming,
              is_active: form.is_active,
              registration_link: form.registration_link.trim() || undefined,
              description: form.description.trim() || "Exciting collegiate science event.",
              full_story: storyParagraphs.length > 0 ? storyParagraphs : ev.full_story || [form.description.trim()],
              segments: segmentsList.length > 0 ? segmentsList : ev.segments || ["Project Display", "Workshops"],
            }
          : ev
      );
    } else {
      // Clean sequential integer ID
      const maxId = currentList.reduce((max, ev) => Math.max(max, Number(ev.id) || 0), 0);
      const newId = Math.max(maxId, 4) + 1;

      const newEvent: ClubEvent = {
        id: newId,
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || undefined,
        category: form.category.trim() || "Upcoming Event",
        date: cleanIconText(form.date) || "Scheduled Date",
        duration: form.duration.trim() || "1-Day Program",
        location: cleanIconText(form.location) || "Govt. Science College Campus, Tejgaon, Dhaka",
        banner_url: banner,
        image_url: banner,
        is_upcoming: form.is_upcoming,
        is_active: form.is_active,
        registration_link: form.registration_link.trim() || undefined,
        description: form.description.trim() || "Exciting collegiate science event organized by GSCSC.",
        full_story: storyParagraphs.length > 0 ? storyParagraphs : [form.description.trim() || "Welcome to this official event organized by Govt. Science College Science Club."],
        segments: segmentsList.length > 0 ? segmentsList : ["Project Display", "Workshops", "Olympiad Circuits"],
        gallery: [{ url: banner, caption: form.title.trim() }]
      };

      updated = [newEvent, ...currentList.filter((e) => e.id !== newId)];
    }

    setEvents(updated);
    saveStoredEvents(updated);

    setShowForm(false);
    setEditId(null);
    setForm({ ...BLANK_FORM });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const startEdit = (ev: ClubEvent) => {
    setEditId(ev.id);
    setForm({
      title: ev.title || "",
      subtitle: ev.subtitle || "",
      category: ev.category || "Upcoming Event",
      date: ev.date || "",
      duration: ev.duration || "1-Day Program",
      location: ev.location || "Govt. Science College Campus, Tejgaon, Dhaka",
      banner_url: ev.banner_url || (ev as any).image_url || "/events/event-1.jpg",
      is_upcoming: ev.is_upcoming !== false,
      is_active: ev.is_active !== false,
      registration_link: ev.registration_link || "",
      description: ev.description || "",
      full_story_text: ev.full_story ? ev.full_story.join("\n\n") : ev.description || "",
      segments_text: ev.segments ? ev.segments.join("\n") : "",
    });
    setImageError(null);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    const target = events.find((e) => e.id === id);
    if (!confirm(`Are you sure you want to delete "${target?.title || 'this event'}"?`)) return;
    const updated = events.filter((ev) => ev.id !== id);
    setEvents(updated);
    saveStoredEvents(updated);
  };

  const currentBanner = form.banner_url;

  return (
    <div className="p-4 sm:p-6 max-w-5xl">
      {/* Hidden file input for quick direct upload on cards */}
      <input
        type="file"
        ref={quickUploadInputRef}
        accept="image/*"
        onChange={handleQuickUploadSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar size={20} className="text-cyan-400" /> Events &amp; Festivals Manager
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Create upcoming events, upload event posters/banners, update dates, registration links, and full event details.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({ ...BLANK_FORM });
            setImageError(null);
          }}
          className="btn-primary text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/20"
        >
          <Plus size={15} /> Add New Event
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 size={15} />
          <span>Events updated successfully and synchronized with the live website!</span>
        </div>
      )}

      {/* Event Add/Edit Modal/Form */}
      {showForm && (
        <div className="mb-8 glass-card p-6 border-cyan-500/35 rounded-3xl shadow-2xl bg-slate-950/90">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-cyan-500/20">
            <div>
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-400" />
                {editId !== null ? "Edit Event & Details" : "Create New Event & Upload Poster"}
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Fill out the event details and upload a high-resolution 16:9 banner poster.
              </p>
            </div>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white p-1">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* ── PHOTO UPLOAD ZONE ── */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border-2 border-cyan-500/30">
              <label className="text-cyan-300 text-xs font-bold mb-2 block flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon size={15} className="text-cyan-400" />
                  <span>Event Poster / Banner Image (Mobile &amp; PC Upload)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Recommended aspect ratio: 16:9</span>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* 16:9 Banner Preview Box */}
                <div className="relative w-full sm:w-64 aspect-[16/9] rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-950 flex-shrink-0 flex items-center justify-center shadow-lg group">
                  {currentBanner ? (
                    <>
                      <img
                        src={currentBanner}
                        alt="Event Banner Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/events/event-1.jpg";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, banner_url: "" }))}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-colors"
                        title="Remove banner"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 p-3 text-center">
                      <ImageIcon size={28} className="opacity-40 mb-1" />
                      <span className="text-[11px]">No Banner Uploaded</span>
                    </div>
                  )}
                </div>

                {/* Upload Action Buttons */}
                <div className="flex-1 w-full space-y-3">
                  <input
                    type="file"
                    ref={formFileInputRef}
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="event-banner-file"
                  />

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => formFileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                    >
                      <Upload size={15} />
                      <span>{uploadingImage ? "Optimizing & Compressing..." : "Choose Poster from Phone / PC"}</span>
                    </button>

                    {currentBanner && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        <Check size={12} /> Poster Ready
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={currentBanner.startsWith("data:") ? "" : currentBanner}
                      onChange={(e) => {
                        const normalized = normalizeImageUrl(e.target.value);
                        setForm((prev) => ({ ...prev, banner_url: normalized }));
                      }}
                      placeholder="Or paste direct image URL (e.g. /events/event-1.jpg or Google Drive / Imgur)"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs outline-none focus:border-cyan-400"
                    />
                  </div>

                  {imageError && (
                    <div className="text-rose-400 text-xs flex items-center gap-1">
                      <AlertCircle size={13} /> {imageError}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── BASIC INFO ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-xs font-semibold mb-1 block">Event Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 13th National Science Carnival 2025"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs font-semibold mb-1 block">Category / Segment Tag</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. National Flagship, Rocketry Workshop, Olympiad Bootcamp"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-slate-300 text-xs font-semibold mb-1 block">Date &amp; Schedule</label>
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  placeholder="e.g. March 15–17, 2025"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs font-semibold mb-1 block">Duration</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="e.g. 3-Day Nationwide Festival"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs font-semibold mb-1 block">Venue / Campus</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Govt. Science College Campus, Tejgaon"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Registration Link Input */}
            <div>
              <label className="text-cyan-300 text-xs font-bold mb-1 block">
                External Registration Link (Google Form / Ticket URL)
              </label>
              <input
                type="url"
                value={form.registration_link}
                onChange={(e) => setForm({ ...form, registration_link: e.target.value })}
                placeholder="https://forms.gle/your-event-registration-link"
                className="w-full bg-cyan-950/30 border border-cyan-500/40 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400"
              />
              <span className="text-[0.68rem] text-slate-400 block mt-1">
                If provided, an active &apos;Register Now&apos; button will appear on the homepage and event cards.
              </span>
            </div>

            {/* Short Description */}
            <div>
              <label className="text-slate-300 text-xs font-semibold mb-1 block">
                Short Summary (Shown on homepage and cards)
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief 1-2 sentence overview of the event..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            {/* Detailed Event Story */}
            <div>
              <label className="text-slate-300 text-xs font-semibold mb-1 block">
                Full Event Story / Detailed Description (Shown on event page)
              </label>
              <textarea
                rows={4}
                value={form.full_story_text}
                onChange={(e) => setForm({ ...form, full_story_text: e.target.value })}
                placeholder="Enter complete event description and background. Separate paragraphs with a blank line..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            {/* Segments / Highlights */}
            <div>
              <label className="text-slate-300 text-xs font-semibold mb-1 block">
                Key Segments / Highlights (One per line)
              </label>
              <textarea
                rows={3}
                value={form.segments_text}
                onChange={(e) => setForm({ ...form, segments_text: e.target.value })}
                placeholder="GSC Falcon Rocketry Exhibition&#10;Collegiate Robotics Battle&#10;Science Olympiad"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            {/* Status Switches */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={form.is_upcoming}
                  onChange={(e) => setForm({ ...form, is_upcoming: e.target.checked })}
                  className="accent-cyan-400 w-4 h-4"
                />
                <span className="font-semibold text-cyan-300">Feature as Upcoming (Registration Open)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-200">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="accent-cyan-400 w-4 h-4"
                />
                <span>Active / Published on Website</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/25">
                <Check size={14} />
                <span>{editId !== null ? "Save Changes" : "Publish Event"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {events.map((ev) => {
          const banner = ev.banner_url || (ev as any).image_url;
          return (
            <div
              key={ev.id}
              className="glass-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 rounded-2xl border-slate-800 hover:border-cyan-500/40 transition-all bg-slate-950/70"
            >
              {/* Thumbnail banner preview with Direct Upload Overlay */}
              <div className="relative w-full sm:w-36 md:w-44 aspect-[16/9] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center group">
                <img
                  src={banner || "/events/event-1.jpg"}
                  alt={ev.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/events/event-1.jpg";
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setQuickUploadTargetId(ev.id);
                    quickUploadInputRef.current?.click();
                  }}
                  className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-cyan-300 text-[10px] font-bold transition-opacity gap-1"
                  title="Click to replace banner"
                >
                  <Upload size={14} />
                  <span>Change Poster</span>
                </button>
              </div>

              {/* Event Content Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-white">{ev.title}</h3>
                  {ev.is_upcoming ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[0.65rem] font-bold uppercase">
                      Upcoming
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[0.65rem]">
                      Past Festival
                    </span>
                  )}
                  {ev.category && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-sky-300 text-[0.65rem] font-mono">
                      {ev.category}
                    </span>
                  )}
                </div>

                <p className="text-slate-300 text-xs line-clamp-2 mb-2 leading-relaxed">{ev.description}</p>

                <div className="flex items-center gap-4 text-[0.72rem] text-slate-400 flex-wrap">
                  {ev.date && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-cyan-400" />
                      <span>{ev.date}</span>
                    </span>
                  )}
                  {ev.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-cyan-400" />
                      <span className="line-clamp-1">{ev.location}</span>
                    </span>
                  )}
                  {ev.registration_link && (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Registration Link Active
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Clear, labeled, and easy to find */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setQuickUploadTargetId(ev.id);
                    quickUploadInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Upload / Change Poster"
                >
                  <Upload size={13} />
                  <span>Poster</span>
                </button>

                <button
                  onClick={() => startEdit(ev)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Edit details and photos"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>

                <Link
                  href={`/events/${ev.id}`}
                  target="_blank"
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="View Public Event Page"
                >
                  <Eye size={14} />
                </Link>

                <button
                  onClick={() => handleDelete(ev.id)}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors"
                  title="Delete Event"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
