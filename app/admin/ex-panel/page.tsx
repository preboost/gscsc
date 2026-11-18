"use client";

import { useState, useEffect, useRef } from "react";
import {
  History,
  Plus,
  Trash2,
  Edit3,
  X,
  Check,
  Search,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Phone,
  Mail,
  ExternalLink,
  Droplet,
  GraduationCap,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { ALUMNI_MEMBERS, AlumniMember, extractBatchYear, getRoleRank } from "@/lib/alumni-data";
import { compressImageFile, normalizeImageUrl } from "@/lib/imageUtils";

const BLANK: Omit<AlumniMember, "id"> = {
  name: "",
  role: "",
  batch: "",
  photo: "",
  email: "",
  phone: "",
  blood: "",
  undergrad: "",
  postgrad: "",
  other_degrees: "",
  current_position: "",
  social_url: "",
  display_order: 99,
};

export default function AdminExPanel() {
  const [members, setMembers] = useState<AlumniMember[]>(ALUMNI_MEMBERS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<AlumniMember, "id">>({ ...BLANK });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    try {
      const stored = localStorage.getItem("gscsc_ex_panel");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMembers(parsed);
          return;
        }
      }
    } catch {
      // fallback
    }
    setMembers(ALUMNI_MEMBERS);
  }

  function persist(newMembers: AlumniMember[]) {
    setMembers(newMembers);
    try {
      localStorage.setItem("gscsc_ex_panel", JSON.stringify(newMembers));
      // Trigger update event for open public tabs
      window.dispatchEvent(new Event("gscsc_ex_panel_updated"));
    } catch (err) {
      console.error("Storage error:", err);
    }
  }

  // Handle direct file upload from PC / Phone
  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImageError(null);

    try {
      const compressedDataUri = await compressImageFile(file, 800, 1000);
      setForm((prev) => ({ ...prev, photo: compressedDataUri }));
    } catch (err) {
      setImageError((err as Error).message || "Failed to process image file.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // Handle URL change with auto Google Drive normalization
  function handleUrlChange(val: string) {
    const normalized = normalizeImageUrl(val);
    setForm((prev) => ({ ...prev, photo: normalized }));
  }

  async function save() {
    if (!form.name.trim()) {
      alert("Please enter the member's full name.");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      name: form.name.trim(),
      role: form.role.trim(),
      batch: form.batch.trim(),
      display_order: Number(form.display_order) || 99,
    };

    let updated: AlumniMember[];
    if (editId) {
      updated = members.map((x) => (x.id === editId ? { ...x, ...payload } : x));
    } else {
      const newMember: AlumniMember = {
        ...payload,
        id: Date.now(),
      };
      updated = [newMember, ...members];
    }

    persist(updated);

    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm({ ...BLANK });
    setImageError(null);
  }

  function del(id: number) {
    const target = members.find((m) => m.id === id);
    if (!confirm(`Are you sure you want to remove "${target?.name || 'this member'}" from Alumni & Former Panels?`)) return;
    const updated = members.filter((m) => m.id !== id);
    persist(updated);
  }

  function startEdit(m: AlumniMember) {
    setEditId(m.id);
    setForm({
      name: m.name,
      role: m.role || "",
      batch: m.batch || "",
      photo: m.photo || "",
      email: m.email || "",
      phone: m.phone || "",
      blood: m.blood || "",
      undergrad: m.undergrad || "",
      postgrad: m.postgrad || "",
      other_degrees: m.other_degrees || "",
      current_position: m.current_position || "",
      social_url: m.social_url || "",
      display_order: m.display_order || 99,
    });
    setImageError(null);
    setShowForm(true);
  }

  const filtered = members
    .filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase()) ||
        m.batch.toLowerCase().includes(search.toLowerCase()) ||
        (m.blood && m.blood.toLowerCase().includes(search.toLowerCase())) ||
        (m.undergrad && m.undergrad.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const yearDiff = extractBatchYear(b.batch) - extractBatchYear(a.batch);
      if (yearDiff !== 0) return yearDiff;
      const rankDiff = getRoleRank(a.role) - getRoleRank(b.role);
      if (rankDiff !== 0) return rankDiff;
      return (Number(a.display_order) || 99) - (Number(b.display_order) || 99);
    });

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <History size={24} className="text-cyan-400" />
            Alumni &amp; Former Panels Directory
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Managing <span className="text-cyan-300 font-bold">{members.length}</span> members. You can upload photos directly from your device, edit all details, and they immediately sync live on the website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm({ ...BLANK });
              setImageError(null);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Plus size={16} /> Add New Member
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, role, batch, blood group, university..."
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
                {editId ? "Edit Alumni / Panelist" : "Add New Alumni / Panelist"}
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* ════ PHOTO UPLOAD SECTION ════ */}
          <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/25">
            <label className="text-cyan-300 text-xs font-bold mb-2 flex items-center gap-1.5">
              <ImageIcon size={14} className="text-cyan-400" />
              Member Photo (Direct Upload or Link)
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Photo Preview */}
              <div className="relative w-24 h-28 rounded-2xl overflow-hidden border-2 border-cyan-400/50 bg-slate-900 flex-shrink-0 shadow-lg flex items-center justify-center">
                {form.photo ? (
                  <>
                    <img
                      src={form.photo}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, photo: "" }))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-500 shadow-md transition-colors"
                      title="Remove Photo"
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

              {/* Upload Controls */}
              <div className="flex-1 w-full space-y-3">
                {/* Method 1: File Upload */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="member-photo-upload"
                  />
                  <label
                    htmlFor="member-photo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-semibold transition-colors"
                  >
                    <Upload size={14} />
                    <span>{uploadingImage ? "Processing Image..." : "Upload from Computer / Mobile"}</span>
                  </label>
                  <span className="text-slate-400 text-[10px] ml-3 hidden sm:inline">
                    JPG, PNG, WebP (auto-optimized)
                  </span>
                </div>

                {/* Method 2: Image URL (Google Drive / Direct) */}
                <div>
                  <div className="relative">
                    <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={form.photo.startsWith("data:") ? "" : form.photo}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="Or paste image URL (Google Drive, Cloudinary, Imgur, direct link)"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
                    />
                  </div>
                  {form.photo.startsWith("data:") && (
                    <p className="text-[10px] text-emerald-400 mt-1">
                      ✓ Direct device image loaded ({Math.round(form.photo.length / 1024)} KB).
                    </p>
                  )}
                </div>

                {imageError && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {imageError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ════ TEXT FIELDS GRID ════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Full Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Dr. Sumit Saha"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Executive Role / Position *</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. General Secretary / President"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">HSC Batch (e.g. HSC &apos;2018)</label>
              <input
                type="text"
                value={form.batch}
                onChange={(e) => setForm({ ...form, batch: e.target.value })}
                placeholder="e.g. HSC '2018"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Blood Group</label>
              <input
                type="text"
                value={form.blood || ""}
                onChange={(e) => setForm({ ...form, blood: e.target.value })}
                placeholder="e.g. O+, A+, B+, AB+"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Phone Number</label>
              <input
                type="text"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. 017xxxxxxxx"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Email Address</label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. member@gmail.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Social Profile Link (Facebook/LinkedIn)</label>
              <input
                type="text"
                value={form.social_url || ""}
                onChange={(e) => setForm({ ...form, social_url: e.target.value })}
                placeholder="https://facebook.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Current Career / Workplace</label>
              <input
                type="text"
                value={form.current_position || ""}
                onChange={(e) => setForm({ ...form, current_position: e.target.value })}
                placeholder="e.g. Doctor, Medical Officer at BIRDEM"
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

          {/* Academic Degrees Full Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-3.5">
            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Undergraduate Degree &amp; University</label>
              <textarea
                rows={2}
                value={form.undergrad || ""}
                onChange={(e) => setForm({ ...form, undergrad: e.target.value })}
                placeholder="e.g. MBBS · Popular Medical College (2019)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Postgraduate / Higher Degree</label>
              <textarea
                rows={2}
                value={form.postgrad || ""}
                onChange={(e) => setForm({ ...form, postgrad: e.target.value })}
                placeholder="e.g. CCD · DIABETIS · BIRDEM (2025)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs mb-1 block font-medium">Other Degrees / Certifications</label>
              <textarea
                rows={2}
                value={form.other_degrees || ""}
                onChange={(e) => setForm({ ...form, other_degrees: e.target.value })}
                placeholder="e.g. Diploma in Aviation & Aerospace"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
              />
            </div>
          </div>

          {/* Save / Cancel Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-cyan-500/20">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <Check size={16} />
              {saving ? "Saving..." : editId ? "Update Member" : "Save New Member"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setForm({ ...BLANK });
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ════ MEMBERS TABLE / CARDS ════ */}
      <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-cyan-500/20 bg-slate-950/80 text-cyan-400 uppercase font-mono tracking-wider text-[11px]">
                <th className="p-3.5 text-center w-12">#</th>
                <th className="p-3.5">Photo</th>
                <th className="p-3.5">Name &amp; Role</th>
                <th className="p-3.5">Batch</th>
                <th className="p-3.5">Blood</th>
                <th className="p-3.5 hidden md:table-cell">Contact</th>
                <th className="p-3.5 hidden lg:table-cell">Academic &amp; Career</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-slate-500">
                    No alumni members found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-cyan-500/5 transition-colors">
                    {/* Index */}
                    <td className="p-3.5 text-center text-slate-500 font-mono">
                      {idx + 1}
                    </td>

                    {/* Photo thumbnail */}
                    <td className="p-3.5">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-cyan-400/40 bg-slate-950 flex-shrink-0 shadow-md">
                        {m.photo ? (
                          <img
                            src={m.photo}
                            alt={m.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-cyan-400 font-bold">
                            {m.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name & Role */}
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{m.name}</div>
                      <div className="text-cyan-400 text-[11px] font-semibold uppercase">{m.role}</div>
                    </td>

                    {/* Batch */}
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 font-mono text-[10px] font-bold">
                        {m.batch}
                      </span>
                    </td>

                    {/* Blood */}
                    <td className="p-3.5">
                      {m.blood ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-300 text-[10px] font-bold">
                          <Droplet size={10} className="fill-rose-400 text-rose-400" />
                          {m.blood}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="p-3.5 hidden md:table-cell text-slate-300 space-y-1">
                      {m.phone && (
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <Phone size={11} className="text-cyan-400" />
                          <span>{m.phone}</span>
                        </div>
                      )}
                      {m.email && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate max-w-[150px]">
                          <Mail size={11} className="text-sky-400" />
                          <span>{m.email}</span>
                        </div>
                      )}
                    </td>

                    {/* Academic & Career */}
                    <td className="p-3.5 hidden lg:table-cell max-w-xs text-slate-300">
                      {m.undergrad && (
                        <div className="line-clamp-1 text-[11px] text-slate-300">
                          🎓 {m.undergrad}
                        </div>
                      )}
                      {m.current_position && (
                        <div className="line-clamp-1 text-[11px] text-cyan-300/80">
                          💼 {m.current_position}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => startEdit(m)}
                          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors"
                          title="Edit Member"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => del(m.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete Member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
