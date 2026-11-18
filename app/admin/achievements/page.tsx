"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  Award,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon
} from "lucide-react";
import { DEFAULT_ACHIEVEMENTS, AchievementItem, getStoredData, setStoredData } from "@/lib/cmsData";
import { compressImageFile, normalizeImageUrl } from "@/lib/imageUtils";

export default function AdminAchievements() {
  const [items, setItems] = useState<AchievementItem[]>(DEFAULT_ACHIEVEMENTS);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Omit<AchievementItem, "id">>({
    title: "",
    year: "2024",
    category: "Science & Innovation",
    awardBy: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    setItems(getStoredData("achievements", DEFAULT_ACHIEVEMENTS));
  }, []);

  const saveItems = (updated: AchievementItem[]) => {
    setItems(updated);
    setStoredData("achievements", updated);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uri = await compressImageFile(file, 800, 600);
      setForm((prev) => ({ ...prev, image_url: uri }));
    } catch (err) {
      alert((err as Error).message || "Failed to process image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    if (editId) {
      const updated = items.map((it) => (it.id === editId ? { ...form, id: editId } : it));
      saveItems(updated);
    } else {
      const newItem: AchievementItem = { ...form, id: Date.now() };
      saveItems([newItem, ...items]);
    }

    setShowForm(false);
    setEditId(null);
    setForm({ title: "", year: "2024", category: "Science & Innovation", awardBy: "", description: "", image_url: "" });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    const updated = items.filter((it) => it.id !== id);
    saveItems(updated);
  };

  const startEdit = (item: AchievementItem) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      year: item.year,
      category: item.category,
      awardBy: item.awardBy,
      description: item.description,
      image_url: item.image_url || "",
    });
    setShowForm(true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy size={20} className="text-cyan-400" /> Achievements &amp; Awards CMS
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Add, update, or remove the club&apos;s national awards, trophies, certificate photos, and milestones.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({ title: "", year: "2024", category: "Science & Innovation", awardBy: "", description: "", image_url: "" });
          }}
          className="btn-primary text-xs flex items-center gap-1.5"
        >
          <Plus size={15} /> Add Achievement
        </button>
      </div>

      {showForm && (
        <div className="mb-8 glass-card p-6 border-cyan-500/30 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyan-500/20">
            <h3 className="text-white font-bold text-sm">
              {editId ? "Edit Achievement" : "Add New Achievement"}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Direct Image Upload for Trophy / Award Certificate */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20">
              <label className="text-slate-200 text-xs font-bold mb-2 block flex items-center gap-1.5">
                <ImageIcon size={14} className="text-cyan-400" />
                <span>Achievement Photo / Trophy / Certificate (Manual Upload)</span>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-44 aspect-[4/3] rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-900 flex-shrink-0 flex items-center justify-center">
                  {form.image_url ? (
                    <>
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, image_url: "" }))}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition-colors"
                        title="Remove photo"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <div className="text-slate-500 flex flex-col items-center text-[10px]">
                      <ImageIcon size={22} className="opacity-50 mb-1" />
                      <span>No Photo</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="achievement-photo-file"
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
                    {form.image_url && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Check size={12} /> Photo Attached
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={form.image_url?.startsWith("data:") ? "" : form.image_url || ""}
                      onChange={(e) => setForm({ ...form, image_url: normalizeImageUrl(e.target.value) })}
                      placeholder="Or paste direct image URL"
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-xs mb-1 block">Title / Award Name *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. National Champion – Science Fair"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs mb-1 block">Year</label>
                <input
                  type="text"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  placeholder="e.g. 2024"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-xs mb-1 block">Awarding Body / Organization</label>
                <input
                  type="text"
                  value={form.awardBy}
                  onChange={(e) => setForm({ ...form, awardBy: e.target.value })}
                  placeholder="e.g. Ministry of Science & Technology"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs mb-1 block">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Aerospace, Olympiad, Robotics"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block">Detailed Description / Milestone Summary</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs flex items-center gap-1.5">
                <Check size={14} />
                <span>{editId ? "Update Achievement" : "Save Achievement"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3.5">
        {items.map((it) => (
          <div
            key={it.id}
            className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border-slate-800 hover:border-cyan-500/30 transition-all"
          >
            {/* Photo preview */}
            <div className="w-full sm:w-20 aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center">
              {it.image_url ? (
                <img src={it.image_url} alt={it.title} className="w-full h-full object-cover" />
              ) : (
                <Award size={20} className="text-slate-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h3 className="text-sm font-bold text-white">{it.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[0.65rem] font-bold">
                  {it.year}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[0.65rem]">
                  {it.category}
                </span>
              </div>
              <p className="text-xs text-cyan-300 mb-1 font-medium">{it.awardBy}</p>
              <p className="text-slate-400 text-xs line-clamp-1">{it.description}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => startEdit(it)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 transition-colors"
                title="Edit"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => handleDelete(it.id)}
                className="p-2 rounded-xl bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
