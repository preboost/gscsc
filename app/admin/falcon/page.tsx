"use client";

import React, { useState, useEffect } from "react";
import {
  Rocket,
  Save,
  Check,
  Plus,
  Trash2,
  Edit3,
  X,
  Layers,
  Sparkles,
  ArrowUpDown,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { DEFAULT_FALCON, FalconData, getStoredData, setStoredData } from "@/lib/cmsData";
import {
  getStoredFalconFleet,
  saveStoredFalconFleet,
  getStoredFalconSlides,
  saveStoredFalconSlides,
  FalconRocket,
  FalconSlide,
  DEFAULT_FALCON_FLEET,
  DEFAULT_FALCON_SLIDES
} from "@/lib/falcon-data";
import { compressImageFile } from "@/lib/imageUtils";

const BLANK_ROCKET: Omit<FalconRocket, "id"> = {
  name: "",
  year: "2025",
  apogee: "1,500 meters",
  propellant: "Sugar / KNO3 (KNSB)",
  status: "In Flight Trials",
  desc: "",
  display_order: 1,
};

export default function AdminFalconCMS() {
  const [form, setForm] = useState<FalconData>(DEFAULT_FALCON);
  const [savedSpecs, setSavedSpecs] = useState(false);

  // Fleet management
  const [fleet, setFleet] = useState<FalconRocket[]>(DEFAULT_FALCON_FLEET);
  const [editingRocketId, setEditingRocketId] = useState<string | null>(null);
  const [showRocketForm, setShowRocketForm] = useState(false);
  const [rocketForm, setRocketForm] = useState<Omit<FalconRocket, "id">>({ ...BLANK_ROCKET });

  // Slides management
  const [slides, setSlides] = useState<FalconSlide[]>(DEFAULT_FALCON_SLIDES);
  const [newSlide, setNewSlide] = useState<Omit<FalconSlide, "id">>({
    title: "",
    subtitle: "",
    image: "",
    badge: "MISSION GALLERY",
  });
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    setForm(getStoredData("falcon", DEFAULT_FALCON));
    setFleet(getStoredFalconFleet());
    setSlides(getStoredFalconSlides());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveSpecs = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredData("falcon", form);
    setSavedSpecs(true);
    setTimeout(() => setSavedSpecs(false), 3000);
  };

  // Rocket CRUD
  const handleOpenNewRocket = () => {
    setEditingRocketId(null);
    setRocketForm({
      ...BLANK_ROCKET,
      display_order: fleet.length + 1,
    });
    setShowRocketForm(true);
  };

  const handleEditRocket = (r: FalconRocket) => {
    setEditingRocketId(r.id);
    setRocketForm({
      name: r.name,
      year: r.year,
      apogee: r.apogee,
      propellant: r.propellant,
      status: r.status,
      desc: r.desc,
      display_order: r.display_order || 1,
    });
    setShowRocketForm(true);
  };

  const handleSaveRocket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rocketForm.name.trim()) return;

    let updated: FalconRocket[];
    if (editingRocketId) {
      updated = fleet.map((r) =>
        r.id === editingRocketId
          ? { ...r, ...rocketForm, display_order: Number(rocketForm.display_order) || 1 }
          : r
      );
    } else {
      const newR: FalconRocket = {
        id: `falcon-${Date.now()}`,
        ...rocketForm,
        display_order: Number(rocketForm.display_order) || fleet.length + 1,
      };
      updated = [...fleet, newR];
    }

    updated.sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));
    setFleet(updated);
    saveStoredFalconFleet(updated);
    setShowRocketForm(false);
    setEditingRocketId(null);
  };

  const handleDeleteRocket = (id: string) => {
    if (!confirm("Are you sure you want to delete this rocket from the fleet?")) return;
    const updated = fleet.filter((r) => r.id !== id);
    setFleet(updated);
    saveStoredFalconFleet(updated);
  };

  // Slides CRUD
  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlide.title.trim() || !newSlide.image.trim()) return;

    const s: FalconSlide = {
      id: `slide-${Date.now()}`,
      ...newSlide,
    };
    const updated = [...slides, s];
    setSlides(updated);
    saveStoredFalconSlides(updated);
    setNewSlide({ title: "", subtitle: "", image: "", badge: "MISSION GALLERY" });
    setShowSlideForm(false);
  };

  const handleDeleteSlide = (id: string) => {
    if (!confirm("Delete this mission slide?")) return;
    const updated = slides.filter((s) => s.id !== id);
    setSlides(updated);
    saveStoredFalconSlides(updated);
  };

  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const uri = await compressImageFile(file, 1200, 800);
      setNewSlide((prev) => ({ ...prev, image: uri }));
    } catch (err) {
      alert((err as Error).message || "Failed to process photo");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl space-y-12">
      {/* ── Section 1: Overview & Specs ── */}
      <div>
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Rocket size={20} className="text-cyan-400" /> Project GSC Falcon CMS
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Update rocketry mission overviews, apogee records, telemetry specs, and upcoming flight targets.
            </p>
          </div>
          <button onClick={handleSaveSpecs} className="btn-primary text-xs flex items-center gap-2">
            {savedSpecs ? <Check size={14} className="text-emerald-300" /> : <Save size={14} />}
            <span>{savedSpecs ? "Saved to Site!" : "Save Specs"}</span>
          </button>
        </div>

        <form onSubmit={handleSaveSpecs} className="glass-card p-6 border-cyan-500/20 space-y-4">
          <div>
            <label className="text-slate-300 text-xs mb-1 block">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 text-xs mb-1 block">Subtitle / Subhead *</label>
            <input
              type="text"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="text-slate-300 text-xs mb-1 block">Mission Blueprint / Overview</label>
            <textarea
              name="missionOverview"
              rows={3}
              value={form.missionOverview}
              onChange={handleChange}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Apogee Altitude Record</label>
              <input
                type="text"
                name="apogeeRecord"
                value={form.apogeeRecord}
                onChange={handleChange}
                placeholder="e.g. 1.24 Kilometers (4,068 ft)"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Propellant Chemistry</label>
              <input
                type="text"
                name="propellantType"
                value={form.propellantType}
                onChange={handleChange}
                placeholder="e.g. KNSB / Commercial D-Class"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Telemetry &amp; Avionics</label>
              <input
                type="text"
                name="telemetrySpecs"
                value={form.telemetrySpecs}
                onChange={handleChange}
                placeholder="e.g. 915 MHz RF Link, BMP280, GPS"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-slate-300 text-xs mb-1 block">Recovery Architecture</label>
              <input
                type="text"
                name="recoverySystem"
                value={form.recoverySystem}
                onChange={handleChange}
                placeholder="e.g. Dual-chute barometric deployment"
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-cyan-400 text-xs font-semibold mb-1 block">Upcoming Flight Target</label>
            <input
              type="text"
              name="upcomingMission"
              value={form.upcomingMission}
              onChange={handleChange}
              placeholder="e.g. Falcon-III targeting 2.5 km tropospheric research"
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs outline-none focus:border-cyan-400"
            />
          </div>
        </form>
      </div>

      {/* ── Section 2: Falcon Flight Fleet Manager ── */}
      <div>
        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Rocket size={18} className="text-rose-400" /> Falcon Flight Fleet ({fleet.length})
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Manage Falcon rockets, flight test years, apogee records, propellant, and flight status.
            </p>
          </div>
          <button
            onClick={handleOpenNewRocket}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add Rocket to Fleet</span>
          </button>
        </div>

        {/* Modal Form */}
        {showRocketForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="glass-card p-6 w-full max-w-lg border-rose-500/30">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-500/20">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Rocket size={16} className="text-rose-400" />
                  {editingRocketId ? "Edit Rocket Details" : "Add Rocket to Fleet"}
                </h3>
                <button
                  onClick={() => setShowRocketForm(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveRocket} className="space-y-3.5">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Rocket Name *</label>
                  <input
                    type="text"
                    value={rocketForm.name}
                    onChange={(e) => setRocketForm({ ...rocketForm, name: e.target.value })}
                    placeholder="e.g. Falcon-II (Atmospheric Sounding Probe)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-rose-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Year / Mission Date *</label>
                    <input
                      type="text"
                      value={rocketForm.year}
                      onChange={(e) => setRocketForm({ ...rocketForm, year: e.target.value })}
                      placeholder="e.g. 2023–24"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-rose-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Apogee Altitude *</label>
                    <input
                      type="text"
                      value={rocketForm.apogee}
                      onChange={(e) => setRocketForm({ ...rocketForm, apogee: e.target.value })}
                      placeholder="e.g. 1,240 meters"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-rose-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Propellant Composition</label>
                    <input
                      type="text"
                      value={rocketForm.propellant}
                      onChange={(e) => setRocketForm({ ...rocketForm, propellant: e.target.value })}
                      placeholder="e.g. Sugar / KNO3 (KNSB)"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-rose-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Display Order</label>
                    <input
                      type="number"
                      value={rocketForm.display_order}
                      onChange={(e) =>
                        setRocketForm({ ...rocketForm, display_order: Number(e.target.value) })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-rose-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Status Badge *</label>
                  <input
                    type="text"
                    value={rocketForm.status}
                    onChange={(e) => setRocketForm({ ...rocketForm, status: e.target.value })}
                    placeholder="e.g. Successful Flight & Recovery or In Development"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-rose-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Mission Description</label>
                  <textarea
                    rows={3}
                    value={rocketForm.desc}
                    onChange={(e) => setRocketForm({ ...rocketForm, desc: e.target.value })}
                    placeholder="Details about aerodynamics, avionics payload, recovery system..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-rose-400 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRocketForm(false)}
                    className="btn-secondary text-xs px-4"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs px-5">
                    {editingRocketId ? "Update Rocket" : "Add Rocket"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fleet.map((r) => (
            <div
              key={r.id}
              className="glass-card p-5 border-rose-500/20 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-mono font-bold">
                    Order #{r.display_order || 1} • {r.year}
                  </span>
                  <span className="text-[10px] text-cyan-300 font-mono font-semibold">
                    {r.apogee}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-rose-300 transition-colors">
                  {r.name}
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed mb-3 line-clamp-3">
                  {r.desc}
                </p>
                <div className="text-[11px] text-slate-400">
                  <span className="text-rose-300 font-semibold">Status: </span>
                  {r.status}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleEditRocket(r)}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-300 text-xs flex items-center gap-1 transition-colors"
                  title="Edit Rocket"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteRocket(r.id)}
                  className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 text-xs transition-colors"
                  title="Delete Rocket"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Falcon Mission Gallery Slider CMS ── */}
      <div>
        <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon size={18} className="text-amber-400" /> Falcon Mission Slides ({slides.length})
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Featured photos shown in the Falcon Page Mission Image Slider.
            </p>
          </div>
          <button
            onClick={() => setShowSlideForm(!showSlideForm)}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Add Slide</span>
          </button>
        </div>

        {showSlideForm && (
          <form
            onSubmit={handleAddSlide}
            className="glass-card p-5 border-amber-500/30 mb-6 space-y-3.5 max-w-xl"
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles size={14} className="text-amber-400" /> Add Mission Slide
            </h3>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Slide Title *</label>
              <input
                type="text"
                value={newSlide.title}
                onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                placeholder="e.g. Falcon-II Pre-Flight Static Hot-Fire"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Badge Tag</label>
              <input
                type="text"
                value={newSlide.badge}
                onChange={(e) => setNewSlide({ ...newSlide, badge: e.target.value })}
                placeholder="e.g. FLIGHT TESTED • 1.24 KM"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Slide Photo *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSlide.image}
                  onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                  placeholder="Paste image URL or upload photo"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-400"
                  required
                />
                <label className="btn-secondary text-xs cursor-pointer flex items-center gap-1.5 px-3">
                  <Upload size={13} />
                  <span>{uploadingImage ? "Processing..." : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSlideImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Subtitle / Mission Detail</label>
              <textarea
                rows={2}
                value={newSlide.subtitle}
                onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                placeholder="Brief description of the test or hardware displayed..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowSlideForm(false)}
                className="btn-secondary text-xs px-3"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs px-4">
                Save Slide
              </button>
            </div>
          </form>
        )}

        {/* Slides Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {slides.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-32 bg-slate-950">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/75 text-[9px] font-mono font-bold text-amber-300">
                  {s.badge}
                </span>
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">{s.title}</h4>
                  <p className="text-slate-400 text-[11px] line-clamp-2">{s.subtitle}</p>
                </div>
                <div className="pt-2 mt-2 border-t border-white/5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(s.id)}
                    className="text-red-400 hover:text-red-300 p-1 transition-colors"
                    title="Delete slide"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
