"use client";
import { useState, useEffect, useRef } from "react";
import { Handshake, Plus, Trash2, Edit3, X, Check, Globe, Upload, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { compressImageFile, normalizeImageUrl } from "@/lib/imageUtils";
import { DEFAULT_PARTNERS, Partner } from "@/lib/partners-data";

const SB = "https://eaujlyklcwnebzyqpqqe.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhdWpseWtsY3duZWJ6eXFwcXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODU3ODcsImV4cCI6MjA2OTU2MTc4N30.cjBOHdrGPMgx5o8Pc8oBJwxSt1a3iWCh44AkAf-jGIo";
const h = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" };

const BLANK = { name: "", type: "", website: "", description: "", logo_url: "", is_active: true };

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>(DEFAULT_PARTNERS);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({ ...BLANK });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      // First check unified key gscsc_club_partners
      const stored = localStorage.getItem("gscsc_club_partners") || localStorage.getItem("gscsc_partners");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          setPartners(parsed);
          setLoading(false);
          return;
        }
      }
      const r = await fetch(`${SB}/rest/v1/club_partners?order=created_at.desc&limit=100`, { headers: h });
      if (r.ok) {
        const d = await r.json();
        const loaded = d.length >= 5 ? d : DEFAULT_PARTNERS;
        setPartners(loaded);
        persist(loaded);
      } else {
        setPartners(DEFAULT_PARTNERS);
        persist(DEFAULT_PARTNERS);
      }
    } catch {
      setPartners(DEFAULT_PARTNERS);
      persist(DEFAULT_PARTNERS);
    }
    setLoading(false);
  }

  function persist(newPartners: Partner[]) {
    setPartners(newPartners);
    try {
      localStorage.setItem("gscsc_club_partners", JSON.stringify(newPartners));
      localStorage.setItem("gscsc_partners", JSON.stringify(newPartners));
      window.dispatchEvent(new Event("gscsc_club_partners_updated"));
      window.dispatchEvent(new Event("gscsc_partners_updated"));
    } catch {}
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const uri = await compressImageFile(file, 400, 400);
      setForm((prev) => ({ ...prev, logo_url: uri }));
    } catch (err) {
      alert((err as Error).message || "Failed to process logo");
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  async function save() {
    setSaving(true);
    try {
      if (editId) {
        await fetch(`${SB}/rest/v1/club_partners?id=eq.${editId}`, { method: "PATCH", headers: h, body: JSON.stringify(form) });
        persist(partners.map(x => x.id === editId ? { ...x, ...form } : x));
      } else {
        const r = await fetch(`${SB}/rest/v1/club_partners`, { method: "POST", headers: h, body: JSON.stringify(form) });
        const np = r.ok ? (await r.json())[0] : { ...form, id: Date.now(), created_at: new Date().toISOString() };
        persist([np, ...partners]);
      }
    } catch {
      if (editId) persist(partners.map(x => x.id === editId ? { ...x, ...form } : x));
      else persist([{ ...form, id: Date.now(), created_at: new Date().toISOString() } as Partner, ...partners]);
    }
    setSaving(false); setShowForm(false); setEditId(null); setForm({ ...BLANK });
  }

  async function del(id: number) {
    if (!confirm("Remove partner?")) return;
    try { await fetch(`${SB}/rest/v1/club_partners?id=eq.${id}`, { method: "DELETE", headers: h }); } catch { /* offline */ }
    persist(partners.filter(x => x.id !== id));
  }

  async function toggle(p: Partner) {
    try { await fetch(`${SB}/rest/v1/club_partners?id=eq.${p.id}`, { method: "PATCH", headers: h, body: JSON.stringify({ is_active: !p.is_active }) }); } catch { /* offline */ }
    persist(partners.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x));
  }

  function startEdit(p: Partner) {
    setEditId(p.id); setForm({ name: p.name, type: p.type||"", website: p.website||"", description: p.description||"", logo_url: p.logo_url||"", is_active: p.is_active !== false }); setShowForm(true);
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Handshake size={20} className="text-yellow-400" /> Club Partners</h1>
          <p className="text-white/50 text-xs mt-1">{partners.length} partners • {partners.filter(p=>p.is_active).length} active</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...BLANK }); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-300 transition-colors">
          <Plus size={15} /> Add Partner
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-3xl border border-yellow-400/30 bg-yellow-400/5 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-yellow-400/20">
            <h3 className="text-white font-bold text-sm">{editId ? "Edit Partner" : "New Partner"}</h3>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-white/50 hover:text-white"><X size={16} /></button>
          </div>

          {/* Partner Logo Manual Upload */}
          <div className="mb-4 p-4 rounded-2xl bg-black/40 border border-yellow-400/20">
            <label className="text-white/80 text-xs font-bold mb-2 block flex items-center gap-1.5">
              <ImageIcon size={14} className="text-yellow-400" />
              <span>Partner Logo / Brand Mark (Manual Upload)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-yellow-400/30 bg-slate-900 flex-shrink-0 flex items-center justify-center">
                {form.logo_url ? (
                  <>
                    <img src={form.logo_url} alt="Logo Preview" className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => setForm((prev: any) => ({ ...prev, logo_url: "" }))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition-colors"
                      title="Remove logo"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="text-slate-500 flex flex-col items-center text-[10px]">
                    <ImageIcon size={20} className="opacity-50 mb-1" />
                    <span>No Logo</span>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="partner-logo-file"
                />

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs transition-colors shadow-md shadow-yellow-500/20 disabled:opacity-50"
                  >
                    <Upload size={13} />
                    <span>{uploadingLogo ? "Compressing..." : "Upload from Mobile / PC"}</span>
                  </button>
                  {form.logo_url && (
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Check size={12} /> Logo Attached
                    </span>
                  )}
                </div>

                <div className="relative">
                  <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.logo_url?.startsWith("data:") ? "" : form.logo_url || ""}
                    onChange={(e) => setForm((prev: any) => ({ ...prev, logo_url: normalizeImageUrl(e.target.value) }))}
                    placeholder="Or paste direct logo URL"
                    className="w-full pl-8 pr-3 py-1.5 bg-black/60 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[["name","Organisation Name *"],["type","Type (e.g. Academic Partner)"],["website","Website URL"]].map(([k,l]) => (
              <div key={k}>
                <label className="text-white/60 text-xs mb-1 block">{l}</label>
                <input type="text" value={form[k]} onChange={e => setForm((f: any) => ({ ...f, [k]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-yellow-400/50 transition-colors" />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-white/60 text-xs mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-yellow-400/50 transition-colors resize-none" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm((f: any) => ({ ...f, is_active: e.target.checked }))} className="accent-yellow-400" />
            <label className="text-white/70 text-xs">Active Partnership</label>
          </div>
          <button onClick={save} disabled={!form.name || saving}
            className="mt-4 flex items-center gap-2 px-5 py-2 rounded-lg bg-yellow-400 text-black text-xs font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50">
            <Check size={14} /> {saving ? "Saving..." : editId ? "Update" : "Add Partner"}
          </button>
        </div>
      )}

      {loading ? <div className="text-white/50 py-20 text-center text-sm">Loading...</div> : (
        <div className="space-y-3">
          {partners.map(p => (
            <div key={p.id} className="rounded-xl border border-white/10 p-4 flex items-center gap-4 hover:border-white/20 transition-colors">
              {/* Partner Logo */}
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {p.logo_url ? (
                  <img src={p.logo_url} alt={p.name} className="w-full h-full object-contain p-1" />
                ) : (
                  <Handshake size={20} className="text-yellow-400/60" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-semibold text-sm">{p.name}</span>
                  {p.type && <span className="px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 text-[0.65rem] font-bold border border-yellow-400/20">{p.type}</span>}
                </div>
                {p.description && <p className="text-white/55 text-xs mt-1">{p.description}</p>}
                {p.website && (
                  <a href={p.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-yellow-400/70 text-[0.68rem] mt-1 hover:text-yellow-400 transition-colors">
                    <Globe size={10} />{p.website}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggle(p)} className={`text-xs px-2 py-1 rounded font-semibold transition-colors ${p.is_active ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25" : "bg-white/5 text-white/40 hover:bg-white/10"}`}>
                  {p.is_active ? "Active" : "Inactive"}
                </button>
                <button onClick={() => startEdit(p)} className="p-1.5 rounded hover:bg-white/10 text-white/50 hover:text-yellow-400 transition-colors"><Edit3 size={14} /></button>
                <button onClick={() => del(p.id)} className="p-1.5 rounded hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
