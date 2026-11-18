"use client";

import { useState, useEffect, useRef } from "react";
import {
  UserPlus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  Phone,
  Mail,
  Shield,
  GraduationCap,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  CreditCard,
  Zap,
  Droplet,
  Users,
  Award
} from "lucide-react";
import { compressImageFile, normalizeImageUrl } from "@/lib/imageUtils";
import { DEFAULT_EXECUTIVES, ExecutiveMember } from "@/lib/executives-data";
import { ALUMNI_MEMBERS, AlumniMember } from "@/lib/alumni-data";

type JoinReq = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  college_roll?: string;
  session?: string;
  role_applied?: string;
  department?: string;
  blood?: string;
  photo?: string;
  institution?: string;
  interest?: string;
  status?: "pending" | "approved" | "rejected";
  created_at: string;
};

type CardTarget = "executive" | "ex_panel" | "sub_executive" | "ambassador";

const SAMPLE_REQS: JoinReq[] = [
  {
    id: 1731800100000,
    name: "Tanzimul Islam",
    email: "tanzim.gsc@gmail.com",
    phone: "01799221144",
    college_roll: "1245",
    session: "2024-2025",
    role_applied: "Executive Committee",
    department: "Robotics & Rocketry Wing",
    blood: "B+",
    interest: "Robotics & Rocketry Wing | Payment: BKASH | TrxID: BK928811A",
    status: "pending",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

export default function AdminJoinRequests() {
  const [reqs, setReqs] = useState<JoinReq[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Approval / Card Creation Modal State
  const [approveModalReq, setApproveModalReq] = useState<JoinReq | null>(null);
  const [cardTarget, setCardTarget] = useState<CardTarget>("executive");
  const [cardForm, setCardForm] = useState({
    name: "",
    role: "Executive Member",
    wing: "Robotics & Rocketry Wing",
    batch: "Batch '24",
    blood: "",
    phone: "",
    email: "",
    photo: "",
  });
  const [savingCard, setSavingCard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    load();
    const handleUpdate = () => load();
    window.addEventListener("gscsc_join_requests_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("gscsc_join_requests_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  function load() {
    try {
      const stored = localStorage.getItem("gscsc_join_requests");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReqs(parsed);
          return;
        }
      }
    } catch {
      // fallback
    }
    setReqs(SAMPLE_REQS);
  }

  function persist(newReqs: JoinReq[]) {
    setReqs(newReqs);
    try {
      localStorage.setItem("gscsc_join_requests", JSON.stringify(newReqs));
      window.dispatchEvent(new Event("gscsc_join_requests_updated"));
    } catch (e) {
      console.error(e);
    }
  }

  function updateStatus(id: number, status: "pending" | "approved" | "rejected") {
    const updated = reqs.map((r) => (r.id === id ? { ...r, status } : r));
    persist(updated);
  }

  function del(id: number) {
    if (!confirm("Are you sure you want to delete this join request?")) return;
    const updated = reqs.filter((r) => r.id !== id);
    persist(updated);
  }

  // Simple & Safe Approval (Does NOT create public cards)
  function autoApproveAndCreateCard(r: JoinReq) {
    updateStatus(r.id, "approved");
    alert(`🎉 Success! Application for "${r.name}" has been APPROVED. No public card was created.`);
  }

  // Open modal to customize card details
  function openApproveModal(r: JoinReq) {
    setApproveModalReq(r);
    const applied = (r.role_applied || "").toLowerCase();
    let initialTarget: CardTarget = "executive";
    if (applied.includes("alumni") || applied.includes("former")) initialTarget = "ex_panel";
    else if (applied.includes("sub-executive") || applied.includes("sub executive")) initialTarget = "sub_executive";
    else if (applied.includes("ambassador")) initialTarget = "ambassador";
    setCardTarget(initialTarget);

    setCardForm({
      name: r.name,
      role: r.role_applied && r.role_applied !== "Executive Committee" ? r.role_applied : "Executive Member",
      wing: r.department || "Robotics & Rocketry Wing",
      batch: r.session ? `Batch '${r.session.slice(-2)}` : "Batch '24",
      blood: r.blood || "",
      phone: r.phone || "",
      email: r.email || "",
      photo: r.photo || "",
    });
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const uri = await compressImageFile(file, 600, 800);
      setCardForm((prev) => ({ ...prev, photo: uri }));
    } catch (err) {
      alert((err as Error).message);
    }
  }

  // Confirm custom modal approval and publish card
  async function confirmApproveAndCreateCard() {
    if (!approveModalReq) return;
    setSavingCard(true);

    try {
      if (cardTarget === "executive") {
        const stored = localStorage.getItem("gscsc_executives");
        const list = stored ? JSON.parse(stored) : [...DEFAULT_EXECUTIVES];
        const newExec: ExecutiveMember = {
          id: Date.now(),
          name: cardForm.name,
          role: cardForm.role,
          department: cardForm.wing,
          session: cardForm.batch,
          photo: cardForm.photo || "",
          phone: cardForm.phone,
          email: cardForm.email,
          blood: cardForm.blood,
          bio: approveModalReq.interest ? approveModalReq.interest.split("|")[0].trim() : "",
          display_order: list.length + 1,
        };
        list.push(newExec);
        localStorage.setItem("gscsc_executives", JSON.stringify(list));
        window.dispatchEvent(new Event("gscsc_executives_updated"));
      } else if (cardTarget === "ex_panel") {
        const stored = localStorage.getItem("gscsc_ex_panel");
        const list = stored ? JSON.parse(stored) : [...ALUMNI_MEMBERS];
        const newAlumni: AlumniMember = {
          id: Date.now(),
          name: cardForm.name,
          role: cardForm.role,
          batch: cardForm.batch,
          photo: cardForm.photo || "",
          phone: cardForm.phone,
          email: cardForm.email,
          blood: cardForm.blood,
          undergrad: approveModalReq.institution || "Govt. Science College",
          current_position: cardForm.wing,
          display_order: 1,
        };
        list.unshift(newAlumni);
        localStorage.setItem("gscsc_ex_panel", JSON.stringify(list));
        window.dispatchEvent(new Event("gscsc_ex_panel_updated"));
      } else if (cardTarget === "sub_executive") {
        const stored = localStorage.getItem("gscsc_sub_executives");
        const list = stored ? JSON.parse(stored) : [];
        const newSub = {
          id: Date.now(),
          name: cardForm.name,
          role: cardForm.role,
          department: cardForm.wing,
          session: cardForm.batch,
          photo: cardForm.photo || "",
          display_order: list.length + 1,
          created_at: new Date().toISOString(),
        };
        list.push(newSub);
        localStorage.setItem("gscsc_sub_executives", JSON.stringify(list));
        window.dispatchEvent(new Event("gscsc_sub_executives_updated"));
      } else {
        const stored = localStorage.getItem("gscsc_ambassadors");
        const list = stored ? JSON.parse(stored) : [];
        const newAmb = {
          id: Date.now(),
          name: cardForm.name,
          institution: approveModalReq.institution || "College",
          location: "Dhaka",
          points: 100,
          rank: list.length + 1,
          profile_image: cardForm.photo || "",
          created_at: new Date().toISOString(),
        };
        list.push(newAmb);
        localStorage.setItem("gscsc_ambassadors", JSON.stringify(list));
        window.dispatchEvent(new Event("gscsc_ambassadors_updated"));
      }

      updateStatus(approveModalReq.id, "approved");
      alert(`Success! "${cardForm.name}" has been approved and their official card is now live.`);
      setApproveModalReq(null);
    } catch (err) {
      console.error(err);
      alert("Error creating member card. Please try again.");
    } finally {
      setSavingCard(false);
    }
  }

  const filtered = reqs.filter((r) => {
    const matchesFilter = filter === "all" || (r.status || "pending") === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone && r.phone.includes(q)) ||
      (r.college_roll && r.college_roll.includes(q)) ||
      (r.department && r.department.toLowerCase().includes(q)) ||
      (r.interest && r.interest.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <UserPlus size={24} className="text-cyan-400" />
            Membership &amp; Join Requests
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Review applicant registrations. When you click <strong className="text-emerald-400">&quot;Approve &amp; Add Card&quot;</strong>, their card is automatically created on the website.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700"
              }`}
            >
              {f} ({f === "all" ? reqs.length : reqs.filter((r) => (r.status || "pending") === f).length})
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6 relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, roll, email, phone, wing, payment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
        />
      </div>

      {/* Requests Table */}
      <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-cyan-500/20 bg-slate-950/80 text-cyan-400 uppercase font-mono tracking-wider text-[11px]">
                <th className="p-3.5">Applicant Details</th>
                <th className="p-3.5">Roll &amp; Session</th>
                <th className="p-3.5">Wing / Interest</th>
                <th className="p-3.5">Payment / TrxID</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500">
                    No membership join requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const status = r.status || "pending";
                  return (
                    <tr key={r.id} className="hover:bg-cyan-500/5 transition-colors">
                      {/* Name & Contact */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 border border-cyan-500/30 flex-shrink-0 flex items-center justify-center">
                            {r.photo ? (
                              <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-extrabold text-cyan-400 text-sm">{r.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-2">
                              <span>{r.name}</span>
                              {r.blood && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                                  {r.blood}
                                </span>
                              )}
                            </div>
                            <div className="text-cyan-400 text-[11px] font-semibold mt-0.5">
                              {r.role_applied || "Executive Committee"}
                            </div>
                            <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                              <a href={`mailto:${r.email}`} className="hover:text-cyan-300 flex items-center gap-1">
                                <Mail size={11} className="text-cyan-400" /> {r.email}
                              </a>
                            </div>
                            {r.phone && (
                              <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5 font-mono">
                                <Phone size={11} className="text-emerald-400" /> {r.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Roll & Session */}
                      <td className="p-3.5">
                        <div className="font-mono text-cyan-300 font-bold">Roll: {r.college_roll || "—"}</div>
                        <div className="text-slate-400 text-[11px]">Session: {r.session || "—"}</div>
                      </td>

                      {/* Wing / Department */}
                      <td className="p-3.5 max-w-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-400/30 text-sky-200 text-[11px] font-medium block w-fit">
                          {r.department || "General Member"}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="p-3.5 max-w-xs">
                        <div className="text-[11px] text-slate-300 break-words font-mono bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                          {r.interest || "Cash on Delivery (Pending)"}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        {status === "approved" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-[10px] uppercase">
                            <CheckCircle2 size={12} /> Approved
                          </span>
                        )}
                        {status === "rejected" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 font-bold text-[10px] uppercase">
                            <XCircle size={12} /> Rejected
                          </span>
                        )}
                        {status === "pending" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-[10px] uppercase">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {status !== "approved" && (
                            <>
                              <button
                                onClick={() => autoApproveAndCreateCard(r)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/25"
                                title="Auto-Approve & Instantly Create Card"
                              >
                                <Zap size={13} className="fill-slate-950" />
                                <span>Auto-Approve &amp; Add Card</span>
                              </button>

                              <button
                                onClick={() => openApproveModal(r)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
                                title="Review & Customize before card creation"
                              >
                                <Sparkles size={14} />
                              </button>
                            </>
                          )}

                          {status !== "rejected" && status !== "approved" && (
                            <button
                              onClick={() => updateStatus(r.id, "rejected")}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                              title="Reject Request"
                            >
                              <XCircle size={15} />
                            </button>
                          )}

                          <button
                            onClick={() => del(r.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════ APPROVAL & AUTO-CARD CREATION MODAL ════ */}
      {approveModalReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl border border-cyan-400/40 bg-slate-900 p-6 sm:p-7 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-cyan-400" />
                  Approve Applicant &amp; Create Member Card
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Confirming this will automatically publish their card to the live website.
                </p>
              </div>
              <button
                onClick={() => setApproveModalReq(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Target Destination Choice */}
            <div className="mb-4">
              <label className="text-slate-300 text-xs font-bold block mb-2">
                Where should this member&apos;s card be added?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCardTarget("executive")}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    cardTarget === "executive"
                      ? "border-cyan-400 bg-cyan-500/15 text-white"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-cyan-300">
                    <Shield size={14} /> Executive Committee
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Live at /panel/executive
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCardTarget("sub_executive")}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    cardTarget === "sub_executive"
                      ? "border-cyan-400 bg-cyan-500/15 text-white"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-yellow-300">
                    <Users size={14} /> Sub-Executive
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Sub-Executive Panel
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCardTarget("ambassador")}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    cardTarget === "ambassador"
                      ? "border-cyan-400 bg-cyan-500/15 text-white"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-emerald-300">
                    <Award size={14} /> Campus Ambassador
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Ambassador Leaderboard
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCardTarget("ex_panel")}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    cardTarget === "ex_panel"
                      ? "border-cyan-400 bg-cyan-500/15 text-white"
                      : "border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs text-sky-300">
                    <GraduationCap size={14} /> Alumni &amp; Former Panels
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    3D Flip Alumni Directory
                  </div>
                </button>
              </div>
            </div>

            {/* Photo Upload for Card */}
            <div className="mb-4 p-3 rounded-2xl bg-slate-950 border border-cyan-500/20 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-cyan-400/50 bg-slate-900 flex-shrink-0 flex items-center justify-center">
                {cardForm.photo ? (
                  <img src={cardForm.photo} alt="Card Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={20} className="text-slate-500" />
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="approve-card-photo"
                />
                <label
                  htmlFor="approve-card-photo"
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/25 transition-colors"
                >
                  <Upload size={12} />
                  <span>{cardForm.photo ? "Change Photo" : "Upload Member Photo"}</span>
                </label>
                <input
                  type="text"
                  value={cardForm.photo.startsWith("data:") ? "" : cardForm.photo}
                  onChange={(e) => setCardForm((prev) => ({ ...prev, photo: normalizeImageUrl(e.target.value) }))}
                  placeholder="Or paste photo URL"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Editable Card Fields */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className="text-slate-300 text-xs mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={cardForm.name}
                  onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs mb-1 block">Role / Designation</label>
                <input
                  type="text"
                  value={cardForm.role}
                  onChange={(e) => setCardForm({ ...cardForm, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs mb-1 block">Wing / Department</label>
                <input
                  type="text"
                  value={cardForm.wing}
                  onChange={(e) => setCardForm({ ...cardForm, wing: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs mb-1 block">Batch (e.g. Batch &apos;24)</label>
                <input
                  type="text"
                  value={cardForm.batch}
                  onChange={(e) => setCardForm({ ...cardForm, batch: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs mb-1 block">Blood Group</label>
                <input
                  type="text"
                  value={cardForm.blood}
                  onChange={(e) => setCardForm({ ...cardForm, blood: e.target.value })}
                  placeholder="e.g. B+, O+"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs mb-1 block">Phone</label>
                <input
                  type="text"
                  value={cardForm.phone}
                  onChange={(e) => setCardForm({ ...cardForm, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-cyan-500/20">
              <button
                onClick={confirmApproveAndCreateCard}
                disabled={savingCard}
                className="flex-1 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/25 disabled:opacity-50"
              >
                <Check size={16} />
                <span>{savingCard ? "Creating Card & Publishing..." : "Confirm & Publish Member Card"}</span>
              </button>
              <button
                onClick={() => setApproveModalReq(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
