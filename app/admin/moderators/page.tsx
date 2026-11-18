"use client";

import { useState, useEffect, useRef } from "react";
import {
  Award,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Search,
  Phone,
  Mail,
  GraduationCap
} from "lucide-react";
import { compressImageFile, normalizeImageUrl } from "@/lib/imageUtils";
import { DEFAULT_MODERATORS, Moderator } from "@/lib/moderators-data";

const BLANK: Omit<Moderator, "id"> = {
  name: "",
  designation: "",
  department: "Govt. Science College, Dhaka",
  tag: "Faculty Advisor",
  bio: "",
  photo: "",
  phone: "",
  email: "",
  display_order: 99,
};

export default function AdminModerators() {
  const [moderators, setModerators] = useState<Moderator[]>(DEFAULT_MODERATORS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Moderator, "id">>({ ...BLANK });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    try {
      const stored = localStorage.getItem("gscsc_club_moderators");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setModerators(parsed.sort((a: any, b: any) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99)));
          return;
        }
      }
    } catch {
      // fallback
    }
    setModerators([...DEFAULT_MODERATORS].sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99)));
  }

  function persist(newMods: Moderator[]) {
    setModerators(newMods);
    try {
      localStorage.setItem("gscsc_club_moderators", JSON.stringify(newMods));
      window.dispatchEvent(new Event("gscsc_moderators_updated"));
    } catch (e) {
      console.error(e);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const dataUri = await compressImageFile(file, 800, 1000);
      setForm((prev) => ({ ...prev, photo: dataUri }));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleUrlChange(val: string) {
    const norm = normalizeImageUrl(val);
    setForm((prev) => ({ ...prev, photo: norm }));
  }

  async function save() {
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      name: form.name.trim(),
      designation: form.designation.trim(),
      department: form.department.trim(),
      display_order: Number(form.display_order) || 99,
    };

    let updated: Moderator[];
    if (editId) {
      updated = moderators
        .map((x) => (x.id === editId ? { ...x, ...payload } : x))
        .sort((a, b) => (a.display_order || 99) - (b.display_order || 99));
    } else {
      const newM: Moderator = {
        ...payload,
        id: Date.now(),
      };
      updated = [...moderators, newM].sort((a, b) => (a.display_order || 99) - (b.display_order || 99));
    }

    persist(updated);
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm({ ...BLANK });
  }

  function del(id: number) {
    const target = moderators.find((x) => x.id === id);
    if (!confirm(`Are you sure you want to remove "${target?.name || 'this moderator'}"?`)) return;
    const updated = moderators.filter((x) => x.id !== id);
    persist(updated);
  }

  function startEdit(m: Moderator) {
    setEditId(m.id);
    setForm({
      name: m.name,
      designation: m.designation || "",
      department: m.department || "",
      tag: m.tag || "",
      bio: m.bio || "",
      photo: m.photo || "",
      phone: m.phone || "",
      email: m.email || "",
      display_order: m.display_order || 99,
    });
    setShowForm(true);
  }

  const filtered = moderators
    .filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.designation.toLowerCase().includes(search.toLowerCase()) ||
        m.department.toLowerCase().includes(search.toLowerCase()) ||
        m.tag.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Award size={24} className="text-cyan-400" />
            Club Moderators Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Managing <span className="text-cyan-300 font-bold">{moderators.length}</span> faculty moderators. Upload pictures directly from device or edit credentials.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setForm({ ...BLANK });
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus size={16} /> Add Moderator
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, designation, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
        />
      </div>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="mb-8 rounded-3xl border border-cyan-500/30 bg-slate-900/95 backdrop-blur-2xl p-5 sm:p-7 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-cyan-500/20">
            <div>
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <Edit3 size={18} className="text-cyan-400" />
                {editId ? "Edit Club Moderator" : "Add New Club Moderator"}
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Changes saved here will appear live on the website immediately.
              </p>
            </div>
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

          {/* Photo upload section */}
          <div className="mb-5 p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/25 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-24 h-28 rounded-2xl overflow-hidden border-2 border-cyan-400/50 bg-slate-900 flex-shrink-0 shadow-lg flex items-center justify-center">
              {form.photo ? (
                <>
                  <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, photo: "" }))}
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
                  id="mod-photo-upload"
                />
                <label
                  htmlFor="mod-photo-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-semibold transition-colors"
                >
                  <Upload size={14} />
                  <span>{uploadingImage ? "Processing..." : "Upload from Computer / Mobile"}</span>
                </label>
              </div>

              <div className="relative">
                <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={form.photo.startsWith("data:") ? "" : form.photo}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="Or paste photo URL / Google Drive link"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Dr. Nazmul Huda"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Designation *</label>
              <input
                type="text"
                required
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                placeholder="e.g. Chief Moderator & Associate Professor"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Department</label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="e.g. Department of Physics"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Advisory Tag</label>
              <input
                type="text"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="e.g. Physics & Research Advisor"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Phone / Office Contact</label>
              <input
                type="text"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="017xxxxxxxx"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Official Email Address</label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="faculty@gsc.edu.bd"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Display Order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div className="sm:col-span-2 md:col-span-3">
              <label className="text-slate-300 text-xs mb-1 block">Mentorship Bio &amp; Academic Focus</label>
              <textarea
                rows={2}
                value={form.bio || ""}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Summary of their mentorship role, research guidance, and student coaching..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-cyan-500/20">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <Check size={16} />
              {saving ? "Saving..." : editId ? "Update Moderator" : "Save Moderator"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setForm({ ...BLANK });
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-cyan-500/20 bg-slate-950/80 text-cyan-400 uppercase font-mono tracking-wider text-[11px]">
                <th className="p-3.5 text-center w-12">#</th>
                <th className="p-3.5">Photo</th>
                <th className="p-3.5">Name &amp; Designation</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Advisory Tag</th>
                <th className="p-3.5 hidden md:table-cell">Contact</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((m, idx) => (
                <tr key={m.id} className="hover:bg-cyan-500/5 transition-colors">
                  <td className="p-3.5 text-center text-slate-500 font-mono">{idx + 1}</td>
                  <td className="p-3.5">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-cyan-400/40 bg-slate-950 flex-shrink-0 flex items-center justify-center font-bold text-cyan-400 shadow-md">
                      {m.photo ? (
                        <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        m.name[0]
                      )}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-white text-sm">{m.name}</div>
                    <div className="text-cyan-400 text-[11px] font-semibold">{m.designation}</div>
                  </td>
                  <td className="p-3.5 text-slate-300">{m.department}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 font-mono text-[10px] font-bold">
                      {m.tag}
                    </span>
                  </td>
                  <td className="p-3.5 hidden md:table-cell text-slate-400 space-y-1">
                    {m.phone && <div className="font-mono text-[11px] text-slate-300">{m.phone}</div>}
                    {m.email && <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{m.email}</div>}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => startEdit(m)}
                        className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => del(m.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
