"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Plus, Trash2, Edit3, X, Check, Upload, Image as ImageIcon, Search } from "lucide-react";
import { compressImageFile } from "@/lib/imageUtils";
import { getStoredProjects, saveStoredProjects, DEFAULT_PROJECTS, ProjectItem } from "@/lib/projects-data";

const BLANK: ProjectItem = {
  id: "",
  title: "",
  tag: "Rocketry Wing",
  year: "2024–25",
  image: "",
  desc: "",
  specs: [],
  team: "Research Team",
  status: "Prototype",
  display_order: 99,
};

export default function AdminProjectsCMS() {
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ProjectItem>({ ...BLANK });
  const [specsInput, setSpecsInput] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setProjects(getStoredProjects());
  }

  function persist(newItems: ProjectItem[]) {
    saveStoredProjects(newItems);
    setProjects(newItems);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uri = await compressImageFile(file, 1200, 800);
      setForm((prev) => ({ ...prev, image: uri }));
    } catch (err) {
      alert((err as Error).message || "Failed to process image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function startEdit(item: ProjectItem) {
    setEditId(item.id);
    setForm({ ...item });
    setSpecsInput(item.specs ? item.specs.join("\n") : "");
    setShowForm(true);
  }

  function handleSave() {
    if (!form.title.trim()) {
      alert("Please enter project title.");
      return;
    }

    setSaving(true);
    const parsedSpecs = specsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const targetId = editId || form.id || `proj-${Date.now()}`;
    const itemToSave: ProjectItem = {
      ...form,
      id: targetId,
      specs: parsedSpecs,
      display_order: Number(form.display_order) || 99,
    };

    let updated: ProjectItem[];
    if (editId) {
      updated = projects.map((p) => (p.id === editId ? itemToSave : p));
    } else {
      updated = [itemToSave, ...projects];
    }

    updated.sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));
    persist(updated);

    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm({ ...BLANK });
    setSpecsInput("");
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const updated = projects.filter((p) => p.id !== id);
    persist(updated);
  }

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tag.toLowerCase().includes(search.toLowerCase()) ||
    p.team.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Sparkles size={24} className="text-cyan-400" />
            Research &amp; Projects Manager
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Managing <span className="text-cyan-300 font-bold">{projects.length}</span> research papers and prototypes. Updates reflect live on the website.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({ ...BLANK, id: `proj-${Date.now()}`, display_order: projects.length + 1 });
            setSpecsInput("");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search projects by title, wing, or team..."
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
              {editId ? "Edit Research Project" : "Add New Project"}
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

          {/* Banner Photo Upload */}
          <div className="mb-5 p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/25 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-44 h-28 rounded-2xl overflow-hidden border-2 border-cyan-400/50 bg-slate-900 flex-shrink-0 shadow-lg flex items-center justify-center">
              {form.image ? (
                <>
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-500 shadow-md"
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 p-2 text-center">
                  <ImageIcon size={24} className="mb-1 text-slate-600" />
                  <span className="text-[9px]">No Photo</span>
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
                placeholder="Or paste image URL (https://...)"
                value={form.image || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Project Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. High-Altitude Atmospheric Sounding Rocket"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Wing / Department Tag</label>
              <input
                type="text"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="e.g. Rocketry Wing, AI & IoT, Green Science"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Year / Session</label>
              <input
                type="text"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                placeholder="e.g. 2024–25"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Team / Lead Researchers</label>
              <input
                type="text"
                value={form.team}
                onChange={(e) => setForm({ ...form, team: e.target.value })}
                placeholder="e.g. Rocketry & Robotics Wing"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              >
                <option value="Prototype">Prototype</option>
                <option value="Competed">Competed</option>
                <option value="Published">Published</option>
                <option value="National Award">National Award</option>
                <option value="Deployed">Deployed</option>
              </select>
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
            <label className="text-slate-300 text-xs mb-1 block font-medium">Project Abstract / Overview</label>
            <textarea
              rows={3}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="Detailed summary of methodology, objectives, and findings..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="mt-3">
            <label className="text-slate-300 text-xs mb-1 block font-medium">
              Technical Specifications (Enter one spec per line)
            </label>
            <textarea
              rows={4}
              value={specsInput}
              onChange={(e) => setSpecsInput(e.target.value)}
              placeholder="Apogee: ~1.2 km&#10;Motor: D-class solid propellant&#10;Recovery: Dual-chute deployment&#10;Telemetry: BMP280 + GPS module"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400 font-mono"
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
              {saving ? "Saving..." : editId ? "Update Project" : "Save New Project"}
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

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-cyan-400/50 transition-all shadow-xl"
          >
            <div>
              {proj.image ? (
                <div className="w-full h-32 rounded-xl overflow-hidden mb-3 border border-cyan-500/20 bg-slate-950">
                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-24 rounded-xl mb-3 border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs">
                  No Image
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold">
                  {proj.tag}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-slate-300 text-[10px]">
                  {proj.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5">{proj.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                {proj.desc}
              </p>

              <div className="text-[11px] text-slate-400 font-mono mb-2">
                Team: <span className="text-white">{proj.team}</span> &bull; {proj.year}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Order: #{proj.display_order}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(proj)}
                  className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
