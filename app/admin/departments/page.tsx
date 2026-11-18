"use client";

import { useState, useEffect, useRef } from "react";
import { Layers, Plus, Trash2, Edit3, X, Check, Upload, Image as ImageIcon, Search, ArrowRight } from "lucide-react";
import { compressImageFile } from "@/lib/imageUtils";
import { getStoredDepartments, saveStoredDepartments, fetchCloudDepartments, DEFAULT_DEPARTMENTS, DepartmentItem } from "@/lib/departments-data";

const BLANK: DepartmentItem = {
  id: "",
  title: "",
  desc: "",
  image: "",
  activities: [],
  display_order: 99,
};

export default function AdminDepartmentsCMS() {
  const [departments, setDepartments] = useState<DepartmentItem[]>(DEFAULT_DEPARTMENTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<DepartmentItem>({ ...BLANK });
  const [activitiesInput, setActivitiesInput] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setDepartments(getStoredDepartments());
    fetchCloudDepartments().then((cloudList) => {
      if (cloudList && cloudList.length > 0) setDepartments(cloudList);
    });
  }

  function persist(newItems: DepartmentItem[]) {
    saveStoredDepartments(newItems);
    setDepartments(newItems);
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

  function startEdit(dept: DepartmentItem) {
    setEditId(dept.id);
    setForm({ ...dept });
    setActivitiesInput(dept.activities ? dept.activities.join("\n") : "");
    setShowForm(true);
  }

  function handleSave() {
    if (!form.title.trim()) {
      alert("Please enter a Department title.");
      return;
    }

    setSaving(true);
    const parsedActivities = activitiesInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const targetId = editId || form.id || `dept-${Date.now()}`;
    const itemToSave: DepartmentItem = {
      ...form,
      id: targetId,
      activities: parsedActivities,
      display_order: Number(form.display_order) || 99,
    };

    let updated: DepartmentItem[];
    if (editId) {
      updated = departments.map((d) => (d.id === editId ? itemToSave : d));
    } else {
      updated = [itemToSave, ...departments];
    }

    updated.sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));
    persist(updated);

    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm({ ...BLANK });
    setActivitiesInput("");
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this department?")) return;
    const updated = departments.filter((d) => d.id !== id);
    persist(updated);
  }

  const filtered = departments.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Layers size={24} className="text-cyan-400" />
            Departments &amp; Specialized Wings Manager
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Managing <span className="text-cyan-300 font-bold">{departments.length}</span> departments. Edits dynamically update the website and join form options.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({ ...BLANK, id: `dept-${Date.now()}`, display_order: departments.length + 1 });
            setActivitiesInput("");
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus size={16} /> Add Department
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search departments..."
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
              {editId ? "Edit Department" : "Add New Department"}
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

          {/* Department Banner Photo Upload */}
          <div className="mb-5 p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/25 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-40 h-24 rounded-2xl overflow-hidden border-2 border-cyan-400/50 bg-slate-900 flex-shrink-0 shadow-lg flex items-center justify-center">
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
              <label className="text-slate-300 text-xs mb-1 block font-medium">Department Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Robotics & Rocketry"
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
            <label className="text-slate-300 text-xs mb-1 block font-medium">Overview Description</label>
            <textarea
              rows={3}
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              placeholder="What this department does and its role inside the club..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="mt-3">
            <label className="text-slate-300 text-xs mb-1 block font-medium">
              Key Activities &amp; Focus Areas (Enter one activity per line)
            </label>
            <textarea
              rows={4}
              value={activitiesInput}
              onChange={(e) => setActivitiesInput(e.target.value)}
              placeholder="Microcontroller programming & sensor fusion&#10;Model rocket flight trials&#10;National competitive hackathons"
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
              {saving ? "Saving..." : editId ? "Update Department" : "Save New Department"}
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

      {/* Grid of Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((d, idx) => (
          <div
            key={d.id}
            className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-cyan-400/50 transition-all shadow-xl"
          >
            <div>
              {d.image ? (
                <div className="w-full h-32 rounded-xl overflow-hidden mb-3 border border-cyan-500/20 bg-slate-950">
                  <img src={d.image} alt={d.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-24 rounded-xl mb-3 border border-dashed border-slate-700 flex items-center justify-center text-slate-500 text-xs">
                  No Image
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono font-bold">
                  Order: #{d.display_order}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1.5">{d.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                {d.desc}
              </p>

              {d.activities && d.activities.length > 0 && (
                <div className="text-[11px] text-slate-500 font-mono mb-3">
                  &bull; {d.activities.length} key focus areas
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => startEdit(d)}
                className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(d.id)}
                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
