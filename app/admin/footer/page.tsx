"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Save,
  Check,
  Eye,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  getStoredContactSettings,
  saveStoredContactSettings,
  fetchCloudContactSettings,
  DEFAULT_CONTACT_SETTINGS,
  ContactSettings,
} from "@/lib/contact-data";

export default function AdminFooterSettingsPage() {
  const [form, setForm] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(getStoredContactSettings());
    fetchCloudContactSettings().then((res) => {
      if (res && (res.phone1 || res.email1)) setForm(res);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredContactSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      {/* Page Title & Action */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <span className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} /> Website Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3 mt-1">
            <Globe className="text-cyan-400" size={28} />
            Website Footer &amp; Branding Settings
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Customize all details displayed in the footer at the bottom of every page across the website—including phone numbers, emails, campus address, club motto, and social media links.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 text-xs font-extrabold hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 cursor-pointer"
        >
          {saved ? <Check size={18} /> : <Save size={18} />}
          <span>{saved ? "Saved to Website!" : "Save Footer Changes"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Brand Tagline & Motto */}
          <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 space-y-4 shadow-xl">
            <h2 className="text-xs font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider font-mono">
              <Sparkles size={15} /> 1. Club Tagline / Footer Motto
            </h2>
            <div>
              <label className="text-slate-300 text-xs mb-1.5 block font-medium">Tagline / Mission Motto</label>
              <input
                type="text"
                name="tagline"
                value={form.tagline || ""}
                onChange={handleChange}
                placeholder="Where curiosity meets innovation since 1981."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1">Displays directly beneath the club name in the footer card.</p>
            </div>
          </div>

          {/* 2. Official Phone Numbers */}
          <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 space-y-4 shadow-xl">
            <h2 className="text-xs font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider font-mono">
              <Phone size={15} /> 2. Official Phone Numbers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-xs mb-1.5 block font-medium">Primary Contact Phone</label>
                <input
                  type="text"
                  name="phone1"
                  value={form.phone1}
                  onChange={handleChange}
                  placeholder="+880 1914-176174"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs mb-1.5 block font-medium">Secondary Contact Phone</label>
                <input
                  type="text"
                  name="phone2"
                  value={form.phone2}
                  onChange={handleChange}
                  placeholder="+880 19151-32965"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 3. Official Email Inboxes */}
          <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 space-y-4 shadow-xl">
            <h2 className="text-xs font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider font-mono">
              <Mail size={15} /> 3. Official Email Inboxes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-xs mb-1.5 block font-medium">General Inquiries Email (Footer)</label>
                <input
                  type="email"
                  name="email1"
                  value={form.email1}
                  onChange={handleChange}
                  placeholder="gscsc.official@gmail.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs mb-1.5 block font-medium">Executive / President Email</label>
                <input
                  type="email"
                  name="email2"
                  value={form.email2}
                  onChange={handleChange}
                  placeholder="gscsc.official@gmail.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 4. Campus Address */}
          <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 space-y-4 shadow-xl">
            <h2 className="text-xs font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider font-mono">
              <MapPin size={15} /> 4. Campus Address
            </h2>
            <div>
              <label className="text-slate-300 text-xs mb-1.5 block font-medium">Campus Physical Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Govt. Science College, Tejgaon, Dhaka-1215, Bangladesh"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          {/* 5. Social & Community Links */}
          <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 space-y-4 shadow-xl">
            <h2 className="text-xs font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider font-mono">
              <Globe size={15} /> 5. Social Channels (Footer Icons)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-xs mb-1.5 block font-medium">Facebook Page URL</label>
                <input
                  type="text"
                  name="facebookPage"
                  value={form.facebookPage}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs mb-1.5 block font-medium">Instagram URL</label>
                <input
                  type="text"
                  name="instagram"
                  value={form.instagram || ""}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs mb-1.5 block font-medium">LinkedIn URL</label>
                <input
                  type="text"
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs mb-1.5 block font-medium">YouTube URL</label>
                <input
                  type="text"
                  name="youtube"
                  value={form.youtube || ""}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-slate-300 text-xs mb-1.5 block font-medium">Discord Community Invite</label>
                <input
                  type="text"
                  name="discord"
                  value={form.discord}
                  onChange={handleChange}
                  placeholder="https://discord.gg/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="text-right pt-2">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/25"
            >
              {saved ? "Saved to Website!" : "Save All Changes"}
            </button>
          </div>
        </div>

        {/* Right Col: Live Preview Card */}
        <div className="space-y-4">
          <div className="sticky top-6">
            <div className="flex items-center gap-2 mb-3 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Eye size={15} /> Live Footer Preview
            </div>

            <div
              className="rounded-3xl border border-cyan-500/25 p-5 space-y-4 shadow-2xl"
              style={{
                background: "rgba(4, 9, 22, 0.95)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Header preview */}
              <div className="flex items-center gap-3 border-b border-cyan-500/15 pb-4">
                <div className="w-10 h-10 rounded-full border border-sky-400/50 p-0.5 bg-slate-900/60 shrink-0">
                  <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <span className="text-white font-extrabold text-base block leading-tight">GSCSC</span>
                  <span className="text-[9px] text-sky-400 font-mono tracking-widest">ESTABLISHED 1981</span>
                </div>
              </div>

              {/* Address & Tagline preview */}
              <div className="space-y-1 text-xs">
                <p className="text-white font-semibold">Govt. Science College Science Club</p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {form.address || "Govt. Science College, Tejgaon, Dhaka-1215, Bangladesh"}
                </p>
                <p className="text-cyan-400 text-[11px] font-semibold italic pt-0.5">
                  &ldquo;{form.tagline || "Where curiosity meets innovation since 1981."}&rdquo;
                </p>
              </div>

              {/* Email & Phone preview */}
              <div className="space-y-1.5 text-[11px] text-slate-300 border-t border-cyan-500/15 pt-3">
                <div>
                  <span className="text-cyan-400 font-bold">Email: </span>
                  <span className="text-slate-200">{form.email1 || "gscsc.official@gmail.com"}</span>
                </div>
                <div>
                  <span className="text-cyan-400 font-bold">Phone: </span>
                  <span className="text-slate-200">{form.phone1 || "+880 1914-176174"}</span>
                  {form.phone2 && (
                    <span className="text-slate-400 ml-1.5">/ {form.phone2}</span>
                  )}
                </div>
              </div>

              {/* Developer Attribution Preview */}
              <div className="border-t border-cyan-500/15 pt-3 text-[10px] text-slate-400 text-center">
                <span>Developed in collaboration with </span>
                <span className="text-cyan-400 font-bold">PreBOOST MARKETING</span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300">
              <p className="font-semibold text-cyan-300 mb-1">⚡ Instant Edge Sync</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Clicking &quot;Save Footer Changes&quot; writes directly to Cloudflare KV Edge and dispatches live events so all visitors see the new numbers and details immediately.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
