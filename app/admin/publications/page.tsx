"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, Plus, Trash2, Edit3, X, Check, Upload, Image as ImageIcon, Search, Sparkles, Clock, CheckCircle2, ChevronDown, ChevronUp, Save } from "lucide-react";
import { compressImageFile } from "@/lib/imageUtils";
import {
  getStoredPublications,
  saveStoredPublications,
  DEFAULT_PUBLICATIONS,
  PublicationItem,
  getStoredFeaturedPublication,
  saveStoredFeaturedPublication,
  fetchCloudFeaturedPublication,
  fetchCloudPublications,
  DEFAULT_FEATURED_PUBLICATION,
  FeaturedPublication,
} from "@/lib/publications-data";

const BLANK: PublicationItem = {
  id: "",
  year: new Date().getFullYear().toString(),
  edition: "",
  bengali: "",
  type: "Annual Science Journal",
  coverImage: "",
  description: "",
  pages: "120 Pages",
  downloadUrl: "",
  display_order: 99,
};

export default function AdminPublicationsCMS() {
  const [publications, setPublications] = useState<PublicationItem[]>(DEFAULT_PUBLICATIONS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PublicationItem>({ ...BLANK });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quickCardFileRef = useRef<HTMLInputElement>(null);
  const [quickCardTargetId, setQuickCardTargetId] = useState<string | null>(null);
  const [uploadingCardId, setUploadingCardId] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Main Featured Publication State
  const [featured, setFeatured] = useState<FeaturedPublication>(DEFAULT_FEATURED_PUBLICATION);
  const [showFeaturedEdit, setShowFeaturedEdit] = useState(true);
  const [savingFeatured, setSavingFeatured] = useState(false);
  const [uploadingFeaturedCover, setUploadingFeaturedCover] = useState(false);
  const [featuredSuccess, setFeaturedSuccess] = useState(false);
  const featuredFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setPublications(getStoredPublications());
    setFeatured(getStoredFeaturedPublication());
    fetchCloudPublications().then((list) => {
      if (list && list.length > 0) setPublications(list);
    });
    fetchCloudFeaturedPublication().then((feat) => {
      if (feat) setFeatured(feat);
    });
  }

  function handleSaveFeatured(e: React.FormEvent) {
    e.preventDefault();
    if (!featured.englishTitle.trim() && !featured.bengaliTitle.trim()) {
      alert("Please provide at least a Title for the main publication.");
      return;
    }
    setSavingFeatured(true);
    saveStoredFeaturedPublication(featured);
    setSavingFeatured(false);
    setFeaturedSuccess(true);
    setTimeout(() => setFeaturedSuccess(false), 3500);
  }

  async function handleFeaturedCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFeaturedCover(true);
    try {
      const uri = await compressImageFile(file, 800, 1100);
      setFeatured((prev) => ({ ...prev, coverImage: uri }));
    } catch (err) {
      alert((err as Error).message || "Failed to process cover image");
    } finally {
      setUploadingFeaturedCover(false);
      if (featuredFileRef.current) featuredFileRef.current.value = "";
    }
  }

  function persist(newItems: PublicationItem[]) {
    saveStoredPublications(newItems);
    setPublications(newItems);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uri = await compressImageFile(file, 600, 850);
      setForm((prev) => ({ ...prev, coverImage: uri }));
    } catch (err) {
      alert((err as Error).message || "Failed to process cover image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleQuickCardCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !quickCardTargetId) return;

    setUploadingCardId(quickCardTargetId);
    try {
      const uri = await compressImageFile(file, 600, 850);
      const updated = publications.map((p) =>
        p.id === quickCardTargetId ? { ...p, coverImage: uri } : p
      );
      persist(updated);
      setSaveSuccessMessage("Cover image uploaded and updated live!");
      setTimeout(() => setSaveSuccessMessage(null), 3500);
    } catch (err) {
      alert((err as Error).message || "Failed to process cover image");
    } finally {
      setUploadingCardId(null);
      setQuickCardTargetId(null);
      if (quickCardFileRef.current) quickCardFileRef.current.value = "";
    }
  }

  function triggerQuickCardUpload(id: string) {
    setQuickCardTargetId(id);
    if (quickCardFileRef.current) {
      quickCardFileRef.current.click();
    }
  }

  function startEdit(item: PublicationItem) {
    setEditId(item.id);
    setForm({ ...item });
    setShowForm(true);
  }

  function handleSave() {
    if (!form.edition.trim()) {
      alert("Please enter publication edition / title.");
      return;
    }

    setSaving(true);
    const targetId = editId || form.id || `pub-${Date.now()}`;
    const itemToSave: PublicationItem = {
      ...form,
      id: targetId,
      display_order: Number(form.display_order) || 99,
    };

    let updated: PublicationItem[];
    if (editId) {
      updated = publications.map((p) => (p.id === editId ? itemToSave : p));
    } else {
      updated = [itemToSave, ...publications];
    }

    updated.sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));
    persist(updated);

    setSaveSuccessMessage(editId ? "Publication updated and synchronized live!" : "New publication created and synchronized live!");
    setTimeout(() => setSaveSuccessMessage(null), 3500);

    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm({ ...BLANK });
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this publication?")) return;
    const updated = publications.filter((p) => p.id !== id);
    persist(updated);
  }

  const filtered = publications.filter((p) =>
    p.edition.toLowerCase().includes(search.toLowerCase()) ||
    p.bengali.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase()) ||
    p.year.includes(search)
  );

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <BookOpen size={24} className="text-cyan-400" />
            Publications &amp; Journals Manager
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Managing <span className="text-cyan-300 font-bold">{publications.length}</span> editions. Updates appear live on the Publications page.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({ ...BLANK, id: `pub-${Date.now()}`, display_order: publications.length + 1 });
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus size={16} /> Add Publication
        </button>
      </div>

      {/* ── Main Featured Publication Editor (Hero Showcase) ── */}
      <div className="mb-8 rounded-3xl border-2 border-cyan-400/40 bg-gradient-to-br from-slate-900/95 via-indigo-950/40 to-slate-950/95 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold text-base sm:text-lg flex items-center gap-2">
                Main Featured Publication (Hero Post)
              </h2>
              <p className="text-slate-400 text-xs">
                Edit the primary showcase card (সবিকল্প ২০২৬) appearing on top of the Publications page.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowFeaturedEdit(!showFeaturedEdit)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            {showFeaturedEdit ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            <span>{showFeaturedEdit ? "Collapse Editor" : "Open Editor"}</span>
          </button>
        </div>

        {featuredSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Main Featured Publication saved and synchronized live!</span>
          </div>
        )}

        {showFeaturedEdit && (
          <form onSubmit={handleSaveFeatured} className="space-y-4 pt-2 border-t border-cyan-500/20">
            {/* Cover Upload for Featured */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/25 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative w-28 h-40 rounded-2xl overflow-hidden border-2 border-cyan-400/50 bg-slate-900 flex-shrink-0 shadow-lg flex items-center justify-center">
                {featured.coverImage ? (
                  <>
                    <img src={featured.coverImage} alt="Featured Cover" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFeatured((prev) => ({ ...prev, coverImage: "" }))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-500 shadow-md"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 p-2 text-center">
                    <ImageIcon size={24} className="mb-1 text-slate-600" />
                    <span className="text-[9px]">Using 3D Cover</span>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full space-y-2.5">
                <span className="text-xs font-semibold text-cyan-300 block">Featured Magazine Cover (Optional)</span>
                <p className="text-[11px] text-slate-400">
                  Upload an image cover, or leave empty to display the built-in 3D magazine graphic.
                </p>
                <div>
                  <input
                    ref={featuredFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedCoverSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => featuredFileRef.current?.click()}
                    disabled={uploadingFeaturedCover}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    <Upload size={14} />
                    <span>{uploadingFeaturedCover ? "Compressing Image..." : "Upload Cover from Device"}</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Or paste cover image URL (https://...)"
                  value={featured.coverImage || ""}
                  onChange={(e) => setFeatured((prev) => ({ ...prev, coverImage: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-slate-300 text-xs mb-1 block font-medium">Bengali Title *</label>
                <input
                  type="text"
                  value={featured.bengaliTitle}
                  onChange={(e) => setFeatured({ ...featured, bengaliTitle: e.target.value })}
                  placeholder="e.g. সবিকল্প ২০২৬"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs mb-1 block font-medium">English Title *</label>
                <input
                  type="text"
                  value={featured.englishTitle}
                  onChange={(e) => setFeatured({ ...featured, englishTitle: e.target.value })}
                  placeholder="e.g. Shobikolpo 2026"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs mb-1 block font-medium">Subtitle / Magazine Category</label>
                <input
                  type="text"
                  value={featured.subtitle}
                  onChange={(e) => setFeatured({ ...featured, subtitle: e.target.value })}
                  placeholder="e.g. Annual Flagship Science Magazine"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs mb-1 block font-medium">Top Tag (Badge)</label>
                <input
                  type="text"
                  value={featured.tag}
                  onChange={(e) => setFeatured({ ...featured, tag: e.target.value })}
                  placeholder="e.g. FLAGSHIP 2026"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs mb-1 block font-medium">Header Badge Label</label>
                <input
                  type="text"
                  value={featured.badge}
                  onChange={(e) => setFeatured({ ...featured, badge: e.target.value })}
                  placeholder="e.g. Flagship Science Anthology"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs mb-1 block font-medium">Special Issue Theme</label>
                <input
                  type="text"
                  value={featured.specialIssue}
                  onChange={(e) => setFeatured({ ...featured, specialIssue: e.target.value })}
                  placeholder="e.g. Orbitfall Protocol"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs mb-1 block font-medium">Status Button Label</label>
                <input
                  type="text"
                  value={featured.statusText}
                  onChange={(e) => setFeatured({ ...featured, statusText: e.target.value })}
                  placeholder="e.g. Coming Soon / Published"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs mb-1 block font-medium">Status Subtext Note</label>
                <input
                  type="text"
                  value={featured.statusSubtext}
                  onChange={(e) => setFeatured({ ...featured, statusSubtext: e.target.value })}
                  placeholder="e.g. Currently in Editorial & Print Phase"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs mb-1 block font-medium">Download / Read URL (Optional)</label>
                <input
                  type="text"
                  value={featured.downloadUrl || ""}
                  onChange={(e) => setFeatured({ ...featured, downloadUrl: e.target.value })}
                  placeholder="https://drive.google.com/... or pdf url"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Main Story / Editorial Description</label>
              <textarea
                rows={3}
                value={featured.description}
                onChange={(e) => setFeatured({ ...featured, description: e.target.value })}
                placeholder="Enter editorial description..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingFeatured}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
              >
                <Save size={15} />
                <span>{savingFeatured ? "Saving..." : "Save Main Featured Post"}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search publications by title or year..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-white text-xs outline-none focus:border-cyan-400"
        />
      </div>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="mb-8 rounded-3xl border border-cyan-500/30 bg-slate-900/95 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-cyan-500/20">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <Edit3 size={18} className="text-cyan-400" />
              {editId ? "Edit Publication" : "Add New Publication"}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cover Photo Upload */}
          <div className="mb-5 p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/25 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-28 h-40 rounded-2xl overflow-hidden border-2 border-cyan-400/50 bg-slate-900 flex-shrink-0 shadow-lg flex items-center justify-center">
              {form.coverImage ? (
                <>
                  <img src={form.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, coverImage: "" }))}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-500 shadow-md"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 p-2 text-center">
                  <ImageIcon size={24} className="mb-1 text-slate-600" />
                  <span className="text-[9px]">No Cover</span>
                </div>
              )}
            </div>

            <div className="flex-1 w-full space-y-2.5">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Upload size={14} />
                  <span>{uploadingImage ? "Compressing..." : "Upload from Mobile / PC"}</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="Or paste cover image URL (https://...)"
                value={form.coverImage || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Edition / Title (English) *</label>
              <input
                type="text"
                value={form.edition}
                onChange={(e) => setForm({ ...form, edition: e.target.value })}
                placeholder="e.g. Shobikolpo 2025 / Anuronon Vol. 33"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Title in Bengali</label>
              <input
                type="text"
                value={form.bengali}
                onChange={(e) => setForm({ ...form, bengali: e.target.value })}
                placeholder="e.g. সবিকল্প ২০২৫"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Publication Type</label>
              <input
                type="text"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="e.g. Annual Science Journal, Flagship Edition"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Release Year</label>
              <input
                type="text"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="e.g. 2025"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Volume Pages</label>
              <input
                type="text"
                value={form.pages}
                onChange={(e) => setForm({ ...form, pages: e.target.value })}
                placeholder="e.g. 148 Pages"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">PDF / Drive Download Link</label>
              <input
                type="text"
                value={form.downloadUrl || ""}
                onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
                placeholder="https://drive.google.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Display Order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="text-slate-300 text-xs mb-1 block font-medium">Description / Editorial Highlights</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Summary of featured research papers, articles, interviews, and contributors..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-cyan-500/20">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <Check size={16} />
              {saving ? "Saving..." : editId ? "Update Publication" : "Save New Publication"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setForm({ ...BLANK });
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {saveSuccessMessage && (
        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 shadow-lg shadow-emerald-950/40 animate-fadeIn">
          <CheckCircle2 size={18} className="shrink-0" />
          <span className="font-semibold">{saveSuccessMessage}</span>
        </div>
      )}

      {/* Hidden file input for direct card cover upload */}
      <input
        type="file"
        ref={quickCardFileRef}
        onChange={handleQuickCardCoverSelect}
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />

      {/* Grid of Publications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((pub) => (
          <div
            key={pub.id}
            className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-cyan-400/50 transition-all shadow-xl group"
          >
            <div>
              {pub.coverImage ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-3 border border-cyan-500/20 bg-slate-950 group/cover">
                  <img src={pub.coverImage} alt={pub.edition} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <button
                      type="button"
                      onClick={() => triggerQuickCardUpload(pub.id)}
                      disabled={uploadingCardId === pub.id}
                      className="px-3 py-1.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg hover:bg-cyan-300 transition-colors"
                    >
                      <Upload size={13} />
                      <span>{uploadingCardId === pub.id ? "Uploading..." : "Change Cover"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerQuickCardUpload(pub.id)}
                  disabled={uploadingCardId === pub.id}
                  className="w-full h-32 rounded-xl mb-3 border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/70 bg-cyan-950/20 hover:bg-cyan-950/40 flex flex-col items-center justify-center text-cyan-300 text-xs gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload size={18} className="text-cyan-400" />
                  <span className="font-semibold">{uploadingCardId === pub.id ? "Uploading..." : "Upload Cover Image"}</span>
                </button>
              )}

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold">
                  {pub.year}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {pub.pages}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-0.5">{pub.edition}</h3>
              {pub.bengali && <div className="text-xs text-cyan-400 mb-2 font-medium">{pub.bengali}</div>}
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                {pub.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Order: #{pub.display_order}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => triggerQuickCardUpload(pub.id)}
                  disabled={uploadingCardId === pub.id}
                  className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Upload Cover"
                >
                  <Upload size={12} />
                  <span className="hidden sm:inline">Cover</span>
                </button>
                <button
                  onClick={() => startEdit(pub)}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit3 size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(pub.id)}
                  className="p-1.5 sm:px-2 sm:py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
