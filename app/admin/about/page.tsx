"use client";

import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Check, Save, Sparkles, UserCheck, Upload, Image as ImageIcon, X, Link as LinkIcon } from "lucide-react";
import { DEFAULT_ABOUT, AboutData, getStoredData, setStoredData } from "@/lib/cmsData";
import { compressImageFile, normalizeImageUrl } from "@/lib/imageUtils";

export default function AdminAboutEditor() {
  const [form, setForm] = useState<AboutData>(DEFAULT_ABOUT);
  const [saved, setSaved] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(getStoredData("about", DEFAULT_ABOUT));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "establishedYear" ? Number(value) || 1981 : value,
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uri = await compressImageFile(file, 600, 800);
      setForm((prev) => ({ ...prev, founderPhoto: uri }));
    } catch (err) {
      alert((err as Error).message || "Failed to process photo");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredData("about", form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen size={20} className="text-cyan-400" /> About &amp; Founder Tribute CMS
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Edit club establishment year (1981), mission, vision, and Founder&apos;s tribute details dynamically.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="btn-primary text-xs flex items-center gap-2"
        >
          {saved ? <Check size={14} className="text-emerald-300" /> : <Save size={14} />}
          <span>{saved ? "Saved to Site!" : "Save Changes"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Establishment Details */}
        <div className="glass-card p-6 border-cyan-500/20">
          <h2 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={16} /> 1. Club Establishment Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-xs mb-1.5 block">Establishment Year *</label>
              <input
                type="number"
                name="establishedYear"
                value={form.establishedYear}
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1.5 block">Club Official Name *</label>
              <input
                type="text"
                name="clubTitle"
                value={form.clubTitle}
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-slate-300 text-xs mb-1.5 block">Hero Story / Overview *</label>
            <textarea
              name="heroStory"
              rows={3}
              value={form.heroStory}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-slate-300 text-xs mb-1.5 block">Mission Statement</label>
              <textarea
                name="mission"
                rows={3}
                value={form.mission}
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1.5 block">Vision Statement</label>
              <textarea
                name="vision"
                rows={3}
                value={form.vision}
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Founder's Tribute CMS */}
        <div className="glass-card p-6 border-cyan-500/20">
          <h2 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wider flex items-center gap-2">
            <UserCheck size={16} /> 2. Founder&apos;s Tribute Section
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-xs mb-1.5 block">Founder&apos;s Full Name *</label>
              <input
                type="text"
                name="founderName"
                value={form.founderName}
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1.5 block">Founder&apos;s Designation / Title</label>
              <input
                type="text"
                name="founderTitle"
                value={form.founderTitle}
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          {/* Founder's Photo Manual Upload */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20">
            <label className="text-slate-200 text-xs font-bold mb-2 block flex items-center gap-1.5">
              <ImageIcon size={14} className="text-cyan-400" />
              <span>Founder&apos;s Portrait Photo (Manual Upload)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-24 h-28 rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-900 flex-shrink-0 flex items-center justify-center">
                {form.founderPhoto ? (
                  <>
                    <img src={form.founderPhoto} alt="Founder Preview" className="w-full h-full object-cover object-top" />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, founderPhoto: "" }))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition-colors"
                      title="Remove photo"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="text-slate-500 flex flex-col items-center text-[10px]">
                    <ImageIcon size={20} className="opacity-50 mb-1" />
                    <span>No Photo</span>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="founder-photo-file"
                />

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-500/20 disabled:opacity-50"
                  >
                    <Upload size={13} />
                    <span>{uploadingImage ? "Compressing..." : "Upload from Mobile / PC"}</span>
                  </button>
                  {form.founderPhoto && (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Check size={12} /> Photo Attached
                    </span>
                  )}
                </div>

                <div className="relative">
                  <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="founderPhoto"
                    value={form.founderPhoto?.startsWith("data:") ? "" : form.founderPhoto}
                    onChange={(e) => setForm((prev) => ({ ...prev, founderPhoto: normalizeImageUrl(e.target.value) }))}
                    placeholder="Or paste direct image URL (/images/founder.jpg or https://...)"
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-slate-300 text-xs mb-1.5 block">Founder&apos;s Biography &amp; Contribution *</label>
            <textarea
              name="founderBio"
              rows={4}
              value={form.founderBio}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors resize-none"
              required
            />
          </div>

          <div className="mt-4">
            <label className="text-slate-300 text-xs mb-1.5 block">Founder&apos;s Inspiring Quote</label>
            <textarea
              name="founderQuote"
              rows={2}
              value={form.founderQuote}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-cyan-400 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            {saved ? "Saved Successfully!" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
