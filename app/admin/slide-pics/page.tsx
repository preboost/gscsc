"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Images,
  Plus,
  Trash2,
  Edit3,
  X,
  Upload,
  Check,
  Sparkles,
  ArrowUpDown,
  MoveLeft,
  MoveRight,
  Eye
} from "lucide-react";
import {
  getStoredSlidePics,
  saveStoredSlidePics,
  SlidePicItem,
  DEFAULT_SLIDE_PICS
} from "@/lib/slide-pics-data";
import { compressImageFile } from "@/lib/imageUtils";

const BLANK_SLIDE: Omit<SlidePicItem, "id"> = {
  title: "",
  caption: "",
  image: "",
  badge: "CLUB MOMENTS",
  display_order: 1,
};

export default function AdminSlidePics() {
  const [pics, setPics] = useState<SlidePicItem[]>(DEFAULT_SLIDE_PICS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<SlidePicItem, "id">>({ ...BLANK_SLIDE });
  const [uploading, setUploading] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPics(getStoredSlidePics());
  }, []);

  const persist = (updated: SlidePicItem[]) => {
    const sorted = [...updated].sort(
      (a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99)
    );
    setPics(sorted);
    saveStoredSlidePics(sorted);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleOpenNew = () => {
    setEditingId(null);
    setForm({
      ...BLANK_SLIDE,
      display_order: pics.length + 1,
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item: SlidePicItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      caption: item.caption || "",
      image: item.image,
      badge: item.badge || "CLUB MOMENTS",
      display_order: item.display_order || 1,
    });
    setShowForm(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image.trim()) {
      alert("Please provide both a Title and an Image.");
      return;
    }

    if (editingId) {
      const updated = pics.map((p) =>
        p.id === editingId
          ? { ...p, ...form, display_order: Number(form.display_order) || 1 }
          : p
      );
      persist(updated);
    } else {
      const newPic: SlidePicItem = {
        id: `slide-pic-${Date.now()}`,
        ...form,
        display_order: Number(form.display_order) || pics.length + 1,
      };
      persist([...pics, newPic]);
    }

    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this sliding picture?")) return;
    const updated = pics.filter((p) => p.id !== id);
    persist(updated);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uri = await compressImageFile(file, 1200, 800);
      setForm((prev) => ({ ...prev, image: uri }));
    } catch (err) {
      alert((err as Error).message || "Failed to process photo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-sky-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[11px] font-mono font-bold uppercase mb-2">
            <Images size={13} className="text-cyan-400" />
            <span>Interactive Visual Marquee</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            Slide Pics Manager
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Upload and manage the photos that continuously slide <strong className="text-cyan-400">Left and Right</strong> across the website marquee gallery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedToast && (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
              <Check size={14} /> Synced to Live Site!
            </span>
          )}
          <button onClick={handleOpenNew} className="btn-primary text-xs flex items-center gap-1.5">
            <Plus size={15} />
            <span>Upload New Slide Pic</span>
          </button>
        </div>
      </div>

      {/* Info Notice Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0">
            <ArrowUpDown size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Automatic Left &amp; Right Motion</span>
              <span className="flex items-center gap-1 text-[10px] text-cyan-300 font-mono">
                <MoveLeft size={11} /> <MoveRight size={11} />
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              The pictures below are dynamically fed into the 2-tier scrolling gallery on the site. Tier 1 glides left-to-right, Tier 2 glides right-to-left.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-300 px-3 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/20">
          {pics.length} Active Photos
        </span>
      </div>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-card p-6 sm:p-7 w-full max-w-xl border-cyan-500/40 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Images size={17} className="text-cyan-400" />
                {editingId ? "Edit Slide Picture" : "Upload Picture for Sliding Marquee"}
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-sky-400 block mb-1">
                  Picture Title / Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 12th National Science Carnival Grand Opening"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-sky-400 block mb-1">
                    Badge Tag (Shown in Corner)
                  </label>
                  <input
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    placeholder="e.g. GSC FALCON, OLYMPIAD, LAB"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-sky-400 block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) =>
                      setForm({ ...form, display_order: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Photo Input (Upload or URL) */}
              <div>
                <label className="text-xs font-semibold text-sky-400 block mb-1">
                  Upload Photo or Paste Image URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={form.image.startsWith("data:") ? "(Uploaded local file)" : form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="Paste direct HTTPS photo link or click Upload"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="btn-secondary text-xs flex items-center gap-1.5 px-3.5 whitespace-nowrap"
                  >
                    <Upload size={13} />
                    <span>{uploading ? "Compressing..." : "Choose File"}</span>
                  </button>
                </div>
              </div>

              {/* Preview Thumbnail */}
              {form.image && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/20">
                  <span className="text-[10px] text-slate-400 font-mono block mb-1.5">
                    Live Preview:
                  </span>
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/90 text-cyan-300 text-[10px] font-mono font-bold">
                      {form.badge || "MOMENT"}
                    </span>
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-xs font-bold text-white line-clamp-1">{form.title}</p>
                      {form.caption && (
                        <p className="text-[10px] text-slate-300 line-clamp-1">{form.caption}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-sky-400 block mb-1">
                  Short Caption / Detail (Optional)
                </label>
                <textarea
                  rows={2}
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="One sentence explaining this moment..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary text-xs px-4"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs px-5">
                  {editingId ? "Update Picture" : "Save to Slide Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Slide Pics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {pics.map((p, idx) => (
          <div
            key={p.id || idx}
            className="group rounded-2xl border border-sky-500/20 bg-slate-900/60 overflow-hidden shadow-lg flex flex-col justify-between hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image Box */}
            <div className="relative w-full h-44 bg-slate-950 overflow-hidden">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Badge & Order */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold shadow-md">
                  {p.badge || "MOMENT"}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-900/90 text-[10px] text-slate-300 font-mono">
                  #{p.display_order || idx + 1}
                </span>
              </div>
            </div>

            {/* Content & Actions */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {p.title}
                </h4>
                {p.caption && (
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {p.caption}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(p)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs flex items-center gap-1 transition-colors"
                  title="Edit Picture"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 text-xs transition-colors"
                  title="Delete Picture"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
