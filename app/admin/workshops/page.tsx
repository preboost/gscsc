"use client";

import { useState, useEffect, useRef } from "react";
import { Cpu, Plus, Trash2, Edit3, X, Check, Upload, Image as ImageIcon, Search, Calendar, MapPin, User, Sparkles } from "lucide-react";
import { compressImageFile } from "@/lib/imageUtils";
import { getStoredWorkshops, saveStoredWorkshops, DEFAULT_WORKSHOPS, WorkshopItem } from "@/lib/workshops-data";

const BLANK: WorkshopItem = {
  id: "",
  title: "",
  badge: "TECHNICAL BOOTCAMP",
  badgeColor: "border-sky-500/30 bg-sky-950/40 text-sky-300",
  image: "",
  date: "",
  time: "",
  location: "",
  lead: "",
  desc: "",
  topics: [],
  regLink: "",
  status: "Registration Open",
  display_order: 99,
};

export default function AdminWorkshopsCMS() {
  const [workshops, setWorkshops] = useState<WorkshopItem[]>(DEFAULT_WORKSHOPS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<WorkshopItem>({ ...BLANK });
  const [topicsInput, setTopicsInput] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setWorkshops(getStoredWorkshops());
  }

  function persist(newItems: WorkshopItem[]) {
    saveStoredWorkshops(newItems);
    setWorkshops(newItems);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uri = await compressImageFile(file, 1920, 1080);
      setForm((prev) => ({ ...prev, image: uri }));
    } catch (err) {
      alert((err as Error).message || "Failed to process image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function startEdit(item: WorkshopItem) {
    setEditId(item.id);
    setForm({ ...item });
    setTopicsInput(item.topics ? item.topics.join("\n") : "");
    setShowForm(true);
  }

  function handleSave() {
    if (!form.title.trim()) {
      alert("Please enter workshop title.");
      return;
    }

    setSaving(true);
    const parsedTopics = topicsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const targetId = editId || form.id || `ws-${Date.now()}`;
    const itemToSave: WorkshopItem = {
      ...form,
      id: targetId,
      topics: parsedTopics,
      display_order: Number(form.display_order) || 99,
    };

    let updated: WorkshopItem[];
    if (editId) {
      updated = workshops.map((w) => (w.id === editId ? itemToSave : w));
    } else {
      updated = [itemToSave, ...workshops];
    }

    updated.sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));
    persist(updated);

    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm({ ...BLANK });
    setTopicsInput("");
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this workshop?")) return;
    const updated = workshops.filter((w) => w.id !== id);
    persist(updated);
  }

  const filtered = workshops.filter((w) =>
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    w.lead.toLowerCase().includes(search.toLowerCase()) ||
    w.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Cpu size={24} className="text-cyan-400" />
            Club Workshops Manager
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Managing <span className="text-cyan-300 font-bold">{workshops.length}</span> workshops. Updates appear live on the Workshops page instantly.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({ ...BLANK, id: `ws-${Date.now()}`, display_order: workshops.length + 1 });
            setTopicsInput("");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus size={16} /> Add Workshop
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search workshops by title, mentor, or description..."
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
              {editId ? "Edit Workshop" : "Add New Workshop"}
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
                  <span className="text-[9px]">No Banner</span>
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
                placeholder="Or paste banner image URL (https://...)"
                value={form.image || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Workshop Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Autonomous Robotics & Microcontroller Architecture"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Badge / Track Category</label>
              <input
                type="text"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="e.g. ROBOTICS & EMBEDDED SYSTEMS"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Date &amp; Schedule</label>
              <input
                type="text"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                placeholder="e.g. May 12, 2025"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Time / Duration</label>
              <input
                type="text"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                placeholder="e.g. 10:00 AM – 4:00 PM"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Venue / Lab Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Aerospace Lab & College Field"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Instructor / Conducted By</label>
              <input
                type="text"
                value={form.lead}
                onChange={(e) => setForm({ ...form, lead: e.target.value })}
                placeholder="e.g. GSC Falcon Research Team"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Registration Link (Google Forms / Portal)</label>
              <input
                type="text"
                value={form.regLink}
                onChange={(e) => setForm({ ...form, regLink: e.target.value })}
                placeholder="https://forms.gle/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-300 text-xs mb-1 block font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                >
                  <option value="Registration Open">Registration Open</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
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
          </div>

          <div className="mt-3">
            <label className="text-slate-300 text-xs mb-1 block font-medium">Workshop Overview / Description</label>
            <textarea
              rows={3}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="Detailed explanation of curriculum, practical demos, and outcomes..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="mt-3">
            <label className="text-slate-300 text-xs mb-1 block font-medium">
              Curriculum Topics (Enter one bullet point per line)
            </label>
            <textarea
              rows={4}
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              placeholder="Aerodynamic stability & center of pressure vs center of gravity&#10;OpenRocket CAD simulation & numerical apogee prediction&#10;Solid propellant grain casting"
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
              {saving ? "Saving..." : editId ? "Update Workshop" : "Save New Workshop"}
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

      {/* Grid of Workshops */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((ws) => (
          <div
            key={ws.id}
            className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-cyan-400/50 transition-all shadow-xl"
          >
            <div>
              {ws.image ? (
                <div className="w-full h-36 rounded-xl overflow-hidden mb-3 border border-cyan-500/20 bg-slate-950">
                  <img src={ws.image} alt={ws.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-24 rounded-xl mb-3 border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs">
                  No Image
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold">
                  {ws.badge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-700 text-slate-300 text-[10px]">
                  {ws.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5">{ws.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                {ws.desc}
              </p>

              <div className="space-y-1.5 text-[11px] text-slate-300 mb-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-1.5 text-sky-300">
                  <Calendar size={13} className="text-sky-400" />
                  <span>{ws.date} &bull; {ws.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin size={13} className="text-rose-400" />
                  <span>{ws.location}</span>
                </div>
                {ws.lead && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <User size={13} className="text-cyan-400" />
                    <span>{ws.lead}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Order: #{ws.display_order}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(ws)}
                  className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(ws.id)}
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
