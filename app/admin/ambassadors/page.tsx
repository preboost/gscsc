"use client";
import { useState, useEffect, useRef } from "react";
import { MapPin, Plus, Trash2, Edit3, X, Check, Trophy, Upload, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { compressImageFile, normalizeImageUrl } from "@/lib/imageUtils";

type Amb = { id: number; name: string; institution?: string; location?: string; points?: number; rank?: number; profile_image?: string; created_at: string };

const SB = "https://eaujlyklcwnebzyqpqqe.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhdWpseWtsY3duZWJ6eXFwcXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODU3ODcsImV4cCI6MjA2OTU2MTc4N30.cjBOHdrGPMgx5o8Pc8oBJwxSt1a3iWCh44AkAf-jGIo";
const h = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" };

const SAMPLE: Amb[] = [
  { id: 1, name: "Mahfuz Alam", institution: "Rajshahi College", location: "Rajshahi", points: 980, rank: 1, profile_image: "", created_at: new Date().toISOString() },
  { id: 2, name: "Sumaiya Noor", institution: "Notre Dame College", location: "Dhaka", points: 870, rank: 2, profile_image: "", created_at: new Date().toISOString() },
  { id: 3, name: "Rafiq Hassan", institution: "Chittagong College", location: "Chittagong", points: 760, rank: 3, profile_image: "", created_at: new Date().toISOString() },
];
const BLANK = { name: "", institution: "", location: "", points: 0, profile_image: "" };

export default function AdminAmbassadors() {
  const [ambs, setAmbs] = useState<Amb[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const stored = localStorage.getItem("gscsc_ambassadors");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAmbs(parsed);
          setLoading(false);
          return;
        }
      }
      const r = await fetch(`${SB}/rest/v1/campus_ambassadors?order=points.desc&limit=100`, { headers: h });
      if (r.ok) { const d = await r.json(); setAmbs(d.length ? d : SAMPLE); }
      else setAmbs(SAMPLE);
    } catch { setAmbs(SAMPLE); }
    setLoading(false);
  }

  function persist(newAmbs: Amb[]) {
    const sorted = [...newAmbs].sort((a,b) => (b.points||0)-(a.points||0));
    setAmbs(sorted);
    try {
      localStorage.setItem("gscsc_ambassadors", JSON.stringify(sorted));
      window.dispatchEvent(new Event("gscsc_ambassadors_updated"));
    } catch {}
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const uri = await compressImageFile(file, 600, 800);
      setForm((prev) => ({ ...prev, profile_image: uri }));
    } catch (err) {
      alert((err as Error).message || "Failed to process photo");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  async function save() {
    setSaving(true);
    const payload = { ...form, points: Number(form.points) };
    try {
      if (editId) {
        await fetch(`${SB}/rest/v1/campus_ambassadors?id=eq.${editId}`, { method: "PATCH", headers: h, body: JSON.stringify(payload) });
        persist(ambs.map(x => x.id === editId ? { ...x, ...payload } : x));
      } else {
        const r = await fetch(`${SB}/rest/v1/campus_ambassadors`, { method: "POST", headers: h, body: JSON.stringify(payload) });
        const newAmb = r.ok ? (await r.json())[0] : { ...payload, id: Date.now(), rank: ambs.length + 1, created_at: new Date().toISOString() };
        persist([...ambs, newAmb]);
      }
    } catch {
      if (editId) persist(ambs.map(x => x.id === editId ? { ...x, ...payload } : x));
      else persist([...ambs, { ...payload, id: Date.now(), rank: ambs.length+1, created_at: new Date().toISOString() } as Amb]);
    }
    setSaving(false); setShowForm(false); setEditId(null); setForm({ ...BLANK });
  }

  async function del(id: number) {
    if (!confirm("Remove ambassador?")) return;
    try { await fetch(`${SB}/rest/v1/campus_ambassadors?id=eq.${id}`, { method: "DELETE", headers: h }); } catch { /* offline */ }
    persist(ambs.filter(x => x.id !== id));
  }

  function startEdit(a: Amb) {
    setEditId(a.id);
    setForm({
      name: a.name,
      institution: a.institution || "",
      location: a.location || "",
      points: a.points || 0,
      profile_image: a.profile_image || "",
    });
    setShowForm(true);
  }

  const MEDAL = ["🥇", "🥈", "🥉"];

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Trophy size={20} className="text-yellow-400" /> Campus Ambassadors</h1>
          <p className="text-white/50 text-xs mt-1">{ambs.length} ambassadors • Sorted by points</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...BLANK }); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-300 transition-colors">
          <Plus size={15} /> Add Ambassador
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-3xl border border-yellow-400/30 bg-yellow-400/5 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-yellow-400/20">
            <h3 className="text-white font-bold text-sm">{editId ? "Edit Ambassador" : "New Ambassador"}</h3>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-white/50 hover:text-white"><X size={16} /></button>
          </div>

          {/* Photo Upload */}
          <div className="mb-4 p-4 rounded-2xl bg-black/40 border border-yellow-400/20">
            <label className="text-white/80 text-xs font-bold mb-2 block flex items-center gap-1.5">
              <ImageIcon size={14} className="text-yellow-400" />
              <span>Ambassador Portrait Photo (Manual Upload)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-20 h-24 rounded-xl overflow-hidden border border-yellow-400/30 bg-slate-900 flex-shrink-0 flex items-center justify-center">
                {form.profile_image ? (
                  <>
                    <img src={form.profile_image} alt="Preview" className="w-full h-full object-cover object-top" />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, profile_image: "" }))}
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
                  id="ambassador-photo-file"
                />

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs transition-colors shadow-md shadow-yellow-500/20 disabled:opacity-50"
                  >
                    <Upload size={13} />
                    <span>{uploadingImage ? "Compressing..." : "Upload from Mobile / PC"}</span>
                  </button>
                  {form.profile_image && (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Check size={12} /> Photo Attached
                    </span>
                  )}
                </div>

                <div className="relative">
                  <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.profile_image?.startsWith("data:") ? "" : form.profile_image || ""}
                    onChange={(e) => setForm((prev) => ({ ...prev, profile_image: normalizeImageUrl(e.target.value) }))}
                    placeholder="Or paste direct image URL"
                    className="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[["name","Full Name *"],["institution","Institution"],["location","City / Location"],["points","Points"]].map(([k,l]) => (
              <div key={k}>
                <label className="text-white/60 text-xs mb-1 block">{l}</label>
                <input type={k==="points"?"number":"text"} value={(form as any)[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-yellow-400/50 transition-colors" />
              </div>
            ))}
          </div>
          <button onClick={save} disabled={!form.name || saving}
            className="mt-4 flex items-center gap-2 px-5 py-2 rounded-lg bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50">
            <Check size={14} /> {saving ? "Saving..." : editId ? "Update" : "Add Ambassador"}
          </button>
        </div>
      )}

      {loading ? <div className="text-white/50 py-20 text-center text-sm">Loading...</div> : (
        <div className="space-y-3">
          {ambs.map((a, i) => (
            <div key={a.id} className="rounded-xl border border-white/10 p-4 flex items-center gap-3 hover:border-white/20 transition-colors">
              <span className="text-lg w-7 text-center">{MEDAL[i] || `#${i+1}`}</span>

              {/* Ambassador Photo */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                {a.profile_image ? (
                  <img src={a.profile_image} alt={a.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <span className="text-yellow-400 font-bold text-xs">{a.name.charAt(0)}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">{a.name}</div>
                <div className="text-white/50 text-xs flex items-center gap-2">
                  {a.institution && <span>{a.institution}</span>}
                  {a.location && <span className="flex items-center gap-0.5"><MapPin size={10} />{a.location}</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-mono font-bold text-sm">{a.points || 0} pts</div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => startEdit(a)} className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-yellow-400 transition-colors"><Edit3 size={14} /></button>
                <button onClick={() => del(a.id)} className="p-1.5 rounded hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
