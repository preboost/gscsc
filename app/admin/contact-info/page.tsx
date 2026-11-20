"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, Globe, Save, Check } from "lucide-react";
import {
  getStoredContactSettings,
  saveStoredContactSettings,
  fetchCloudContactSettings,
  DEFAULT_CONTACT_SETTINGS,
  ContactSettings,
} from "@/lib/contact-data";

export default function AdminContactInfoCMS() {
  const [form, setForm] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(getStoredContactSettings());
    fetchCloudContactSettings().then((res) => {
      if (res && res.phone1) setForm(res);
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
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Phone size={24} className="text-cyan-400" />
            Contact &amp; Club Office Settings
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Update official club phone lines, emails, room location, visiting hours, and social channels displayed on the contact page.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          <span>{saved ? "Saved Successfully!" : "Save Contact Info"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Phone Numbers */}
        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider font-mono">
            <Phone size={16} /> Official Phone Lines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Primary Contact Phone</label>
              <input
                type="text"
                name="phone1"
                value={form.phone1}
                onChange={handleChange}
                placeholder="01889934482"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Secondary Contact Phone</label>
              <input
                type="text"
                name="phone2"
                value={form.phone2}
                onChange={handleChange}
                placeholder="01979464857"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Email Addresses */}
        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider font-mono">
            <Mail size={16} /> Official Email Inboxes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-xs mb-1 block">General Inquiries Email</label>
              <input
                type="email"
                name="email1"
                value={form.email1}
                onChange={handleChange}
                placeholder="contact@gscsc.org"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Executive Panel / President Email</label>
              <input
                type="email"
                name="email2"
                value={form.email2}
                onChange={handleChange}
                placeholder="president@gscsc.org"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Location & Hours */}
        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider font-mono">
            <MapPin size={16} /> Campus Address &amp; Visiting Hours
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Campus Physical Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Govt. Science College, Tejgaon, Dhaka-1215, Bangladesh"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-xs mb-1 block">Club Room / Lab Number</label>
                <input
                  type="text"
                  name="room"
                  value={form.room}
                  onChange={handleChange}
                  placeholder="Room 204, Science Complex (Ground Floor)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs mb-1 block">Advisory &amp; Open Hours</label>
                <input
                  type="text"
                  name="hours"
                  value={form.hours}
                  onChange={handleChange}
                  placeholder="Saturday – Thursday: 10:00 AM – 5:00 PM"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Brand Motto */}
        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider font-mono">
            <Globe size={16} /> Website Footer &amp; Tagline
          </h2>
          <div>
            <label className="text-slate-300 text-xs mb-1 block">Club Tagline / Footer Motto</label>
            <input
              type="text"
              name="tagline"
              value={form.tagline || ""}
              onChange={handleChange}
              placeholder="Where curiosity meets innovation since 1981."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
            />
            <p className="text-[11px] text-slate-500 mt-1">This text appears directly beneath the club name in the website footer across all pages.</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider font-mono">
            <Globe size={16} /> Official Social &amp; Community Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Facebook Page URL</label>
              <input
                type="text"
                name="facebookPage"
                value={form.facebookPage}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Facebook Community Group URL</label>
              <input
                type="text"
                name="facebookGroup"
                value={form.facebookGroup}
                onChange={handleChange}
                placeholder="https://facebook.com/groups/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Instagram URL</label>
              <input
                type="text"
                name="instagram"
                value={form.instagram || ""}
                onChange={handleChange}
                placeholder="https://instagram.com/gscsc.official"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">YouTube Channel URL</label>
              <input
                type="text"
                name="youtube"
                value={form.youtube || ""}
                onChange={handleChange}
                placeholder="https://youtube.com/@gscsc.official"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Discord Community Server URL</label>
              <input
                type="text"
                name="discord"
                value={form.discord}
                onChange={handleChange}
                placeholder="https://discord.gg/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">LinkedIn Page URL</label>
              <input
                type="text"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20"
          >
            {saved ? "Saved to Website!" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
