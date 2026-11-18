"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Search,
  Phone,
  Mail,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Droplet,
  RotateCw,
  Award,
  BookOpen,
  ChevronDown,
  UserPlus,
  Check,
  X,
  CheckCircle2
} from "lucide-react";
import { ALUMNI_MEMBERS, AlumniMember, extractBatchYear, getRoleRank } from "@/lib/alumni-data";

export default function ExPanelistPage() {
  const [members, setMembers] = useState<AlumniMember[]>(ALUMNI_MEMBERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  // Apply / Register modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [applyForm, setApplyForm] = useState({
    name: "",
    email: "",
    phone: "",
    batch: "HSC '2024",
    role_applied: "Alumni Leader / Panelist",
    institution: "",
    current_position: "",
    blood: "B+",
    statement: "",
  });

  // Sync with localStorage if updated via Admin Panel
  useEffect(() => {
    function refreshMembers() {
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
        // fallback to ALUMNI_MEMBERS
      }
      setMembers(ALUMNI_MEMBERS);
    }

    refreshMembers();
    window.addEventListener("gscsc_ex_panel_updated", refreshMembers);
    window.addEventListener("storage", refreshMembers);

    return () => {
      window.removeEventListener("gscsc_ex_panel_updated", refreshMembers);
      window.removeEventListener("storage", refreshMembers);
    };
  }, []);

  const toggleFlip = (id: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.name.trim() || !applyForm.email.trim()) {
      alert("Please provide your name and email.");
      return;
    }
    setSubmitting(true);
    try {
      const newReq = {
        id: Date.now(),
        name: applyForm.name.trim(),
        email: applyForm.email.trim(),
        phone: applyForm.phone.trim(),
        college_roll: "",
        session: applyForm.batch,
        role_applied: `Alumni: ${applyForm.role_applied}`,
        department: applyForm.current_position || applyForm.institution || "Alumni Directory",
        institution: applyForm.institution,
        blood: applyForm.blood,
        interest: applyForm.statement,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      let existing: any[] = [];
      try {
        const raw = localStorage.getItem("gscsc_join_requests");
        if (raw) existing = JSON.parse(raw);
      } catch {}

      const updated = [newReq, ...existing];
      localStorage.setItem("gscsc_join_requests", JSON.stringify(updated));
      window.dispatchEvent(new Event("gscsc_join_requests_updated"));

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowApplyModal(false);
        setApplyForm({
          name: "",
          email: "",
          phone: "",
          batch: "HSC '2024",
          role_applied: "Alumni Leader / Panelist",
          institution: "",
          current_position: "",
          blood: "B+",
          statement: "",
        });
      }, 2500);
    } catch {
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Distinct batches for filter in descending order (2024, 2023, 2022...)
  const allBatches = Array.from(new Set(members.map((m) => m.batch).filter(Boolean))).sort(
    (a, b) => extractBatchYear(b) - extractBatchYear(a) || b.localeCompare(a)
  );

  // Filtered members sorted: 1. Year/batch descending -> 2. Position rank hierarchy -> 3. display_order
  const filtered = members
    .filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.batch.toLowerCase().includes(q) ||
        (m.undergrad && m.undergrad.toLowerCase().includes(q)) ||
        (m.current_position && m.current_position.toLowerCase().includes(q)) ||
        (m.blood && m.blood.toLowerCase().includes(q));

      const matchesBatch = selectedBatch === "all" || m.batch === selectedBatch;
      return matchesSearch && matchesBatch;
    })
    .sort((a, b) => {
      // 1. Year / batch descending (Newest on top)
      const yearDiff = extractBatchYear(b.batch) - extractBatchYear(a.batch);
      if (yearDiff !== 0) return yearDiff;

      // 2. Position hierarchy (President, VP, GS, Joint Sec...)
      const rankDiff = getRoleRank(a.role) - getRoleRank(b.role);
      if (rankDiff !== 0) return rankDiff;

      // 3. Display order
      return (Number(a.display_order) || 99) - (Number(b.display_order) || 99);
    });

  return (
    <main className="subpage-main min-h-screen pt-8 sm:pt-12 pb-24 px-3 sm:px-6 max-w-[1250px] mx-auto">
      {/* Top Back Navigation */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/50 hover:bg-slate-800/70 border border-sky-500/20 text-xs text-sky-300 font-medium backdrop-blur-md transition-all"
        >
          <ArrowLeft size={14} />
          Back to Homepage
        </Link>
      </div>

      {/* Centered Top Logo Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 flex flex-col items-center justify-center">
        <div className="flex justify-center mb-4 sm:mb-5 w-full">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 border-2 border-sky-400/60 shadow-[0_0_30px_rgba(56,189,248,0.45)] bg-slate-900/70 backdrop-blur-xl flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="GSCSC Official Logo"
              width={96}
              height={96}
              priority
              quality={100}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        <div className="flex justify-center mb-3 w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-300 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md font-mono">
            <Sparkles size={12} className="text-sky-400" />
            <span>ALUMNI &amp; FORMER PANELS DIRECTORY</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Alumni &amp; <span className="text-shimmer">Former Panels</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2 max-w-2xl mb-6">
          Honoring 45 years of visionary student leaders who shaped Govt. Science College Science Club. Click on any member&apos;s photo to flip the card and reveal their complete personal &amp; contact details.
        </p>

        {/* Action Button */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://forms.gle/6VDp5eRc6YbgdLUT7"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[0_0_25px_rgba(56,189,248,0.4)] py-2.5 px-6 hover:brightness-110 transition-all cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Apply / Register as Alumni</span>
            <ExternalLink size={14} className="opacity-80" />
          </a>
          <Link
            href="/panel/executive"
            className="btn-secondary text-xs sm:text-sm font-semibold flex items-center gap-1.5 py-2.5 px-5"
          >
            <span>Current Executive Panel &rarr;</span>
          </Link>
        </div>
      </div>

      {/* ─── Search & Filter Controls ─── */}
      <div className="mb-8 p-4 sm:p-5 rounded-3xl border border-sky-500/25 bg-slate-950/60 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" />
          <input
            type="text"
            placeholder="Search by name, role, university, blood..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/80 border border-sky-500/25 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-sky-400 transition-colors"
          />
        </div>

        {/* Batch filter dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-300 font-semibold whitespace-nowrap hidden sm:inline">
            Batch:
          </span>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-sky-500/25 text-sky-300 text-xs font-semibold focus:outline-none focus:border-sky-400 transition-colors"
          >
            <option value="all">All Batches ({members.length})</option>
            {allBatches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Total count badge */}
        <div className="text-xs text-slate-400 font-mono whitespace-nowrap">
          Showing <span className="text-sky-400 font-bold">{filtered.length}</span> of {members.length} leaders
        </div>
      </div>

      {/* ─── 3D Interactive Flip Cards Grid (Full Photo Front / Details Back) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filtered.map((m) => {
          const isFlipped = flippedCards[m.id] || false;

          return (
            <div
              key={m.id}
              className={`flip-card-container h-[480px] w-full cursor-pointer select-none group transition-transform duration-300 hover:-translate-y-1 ${
                isFlipped ? "is-flipped" : ""
              }`}
              onClick={() => toggleFlip(m.id)}
              role="button"
              tabIndex={0}
              aria-label={`Toggle details for ${m.name}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleFlip(m.id);
                }
              }}
            >
              <div className="flip-card-inner">
                {/* ════════ FRONT FACE: FULL CARD PICTURE ════════ */}
                <div className="flip-card-front relative w-full h-full rounded-3xl overflow-hidden border border-sky-500/30 bg-slate-950 shadow-2xl shadow-black/70 group-hover:border-sky-400/60 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] transition-all">
                  {/* Full Bleed Picture */}
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.95] contrast-[1.05] transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-sky-950 flex flex-col items-center justify-center">
                      <div className="w-28 h-28 rounded-full bg-sky-500/20 border-2 border-sky-400/40 flex items-center justify-center text-sky-300 font-extrabold text-4xl shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                        {m.name.charAt(0)}
                      </div>
                      <span className="text-slate-400 text-xs mt-3">Photo Pending</span>
                    </div>
                  )}

                  {/* Top Floating Glass Badges */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 pointer-events-none z-10">
                    <span className="px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-sky-400/40 text-sky-300 text-[11px] font-mono font-bold tracking-wide shadow-lg">
                      {m.batch}
                    </span>
                    {m.blood && (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-rose-400/40 text-rose-300 text-[11px] font-bold shadow-lg">
                        <Droplet size={11} className="text-rose-400 fill-rose-400" />
                        <span>{m.blood}</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom Vignette & Information Overlay */}
                  <div
                    className="absolute inset-x-0 bottom-0 pt-20 pb-5 px-5 z-10 flex flex-col justify-end"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(3, 7, 18, 0.98) 0%, rgba(3, 7, 18, 0.85) 55%, rgba(3, 7, 18, 0.4) 80%, transparent 100%)",
                    }}
                  >
                    <h2 className="text-xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                      {m.name}
                    </h2>
                    <p className="text-sky-400 text-xs font-bold tracking-wider uppercase mt-1 drop-shadow">
                      {m.role}
                    </p>

                    {m.current_position && (
                      <p className="text-slate-300 text-[11px] mt-1 line-clamp-1 opacity-90">
                        {m.current_position}
                      </p>
                    )}

                    {/* Interactive Click-to-Flip Button */}
                    <div className="mt-3.5 inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 text-xs font-semibold backdrop-blur-md shadow-lg shadow-sky-950/40 transition-colors">
                      <RotateCw size={13} className="text-sky-400 group-hover:rotate-180 transition-transform duration-500" />
                      <span>Click photo to view details</span>
                    </div>
                  </div>
                </div>

                {/* ════════ BACK FACE: MEMBER DETAILS & CONTACT ════════ */}
                <div
                  className="flip-card-back relative w-full h-full rounded-3xl overflow-hidden p-6 flex flex-col justify-between border-2 border-sky-400/50 shadow-2xl shadow-sky-950/50"
                  style={{
                    background:
                      "linear-gradient(155deg, rgba(6, 16, 42, 0.98) 0%, rgba(3, 8, 24, 0.99) 100%)",
                    backdropFilter: "blur(24px)",
                  }}
                >
                  {/* Top Header: Mini Avatar & Name */}
                  <div>
                    <div className="flex items-center gap-3 pb-3 border-b border-sky-500/25 mb-3.5">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-sky-400/60 flex-shrink-0 bg-slate-900 shadow-md">
                        {m.photo ? (
                          <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sky-400 font-bold text-lg">
                            {m.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-white leading-tight truncate">
                          {m.name}
                        </h3>
                        <p className="text-[11px] text-sky-400 font-bold uppercase tracking-wide truncate">
                          {m.role}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {m.batch}
                        </span>
                      </div>
                      {m.blood && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-[10px] font-bold">
                          {m.blood}
                        </span>
                      )}
                    </div>

                    {/* Scrollable details container */}
                    <div className="space-y-2.5 text-xs max-h-[290px] overflow-y-auto pr-1">
                      {/* Email */}
                      {m.email && (
                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/70 border border-sky-500/20">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                            <Mail size={13} className="text-sky-400" />
                            Email:
                          </span>
                          <a
                            href={`mailto:${m.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-[11px] text-sky-300 truncate max-w-[170px] hover:underline"
                            title={m.email}
                          >
                            {m.email}
                          </a>
                        </div>
                      )}

                      {/* Social Profile */}
                      {m.social_url ? (
                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/70 border border-sky-500/20">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                            <ExternalLink size={13} className="text-sky-400" />
                            Social:
                          </span>
                          <a
                            href={m.social_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-sky-300 font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            <span>View Profile</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      ) : m.social_handle ? (
                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/70 border border-sky-500/20">
                          <span className="text-[11px] text-slate-400">Social:</span>
                          <span className="text-xs text-slate-200">{m.social_handle}</span>
                        </div>
                      ) : null}

                      {/* Academic Credentials */}
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-sky-500/20 space-y-2">
                        <div className="text-[10px] font-mono uppercase text-sky-400 font-bold flex items-center gap-1.5">
                          <GraduationCap size={13} />
                          <span>Academic Credentials</span>
                        </div>
                        {m.undergrad && (
                          <div className="text-[11px] text-slate-200 leading-snug">
                            <strong className="text-slate-400">Undergrad:</strong> {m.undergrad}
                          </div>
                        )}
                        {m.postgrad && (
                          <div className="text-[11px] text-slate-300 leading-snug">
                            <strong className="text-slate-400">Postgrad:</strong> {m.postgrad}
                          </div>
                        )}
                        {m.other_degrees && (
                          <div className="text-[11px] text-slate-300 leading-snug">
                            <strong className="text-slate-400">Other:</strong> {m.other_degrees}
                          </div>
                        )}
                      </div>

                      {/* Current Career / Position */}
                      {m.current_position && (
                        <div className="p-3 rounded-xl bg-slate-950/70 border border-sky-500/20">
                          <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5 mb-1">
                            <Briefcase size={13} />
                            <span>Career &amp; Position</span>
                          </div>
                          <p className="text-xs text-slate-200 font-medium leading-relaxed">
                            {m.current_position}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Flip Back Button */}
                  <div className="pt-3 border-t border-sky-500/20 mt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlip(m.id);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <RotateCw size={12} className="text-sky-400" />
                      <span>Click to view photo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-20 p-8 rounded-3xl border border-sky-500/20 bg-slate-950/60 backdrop-blur-xl">
          <p className="text-slate-400 text-sm">No alumni leaders found matching your search.</p>
        </div>
      )}

      {/* ─── Apply / Register for Alumni Directory Modal ─── */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-sky-500/40 bg-slate-950 p-6 sm:p-8 shadow-2xl shadow-sky-500/20 text-left">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 border border-sky-500/30 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-2">
                <GraduationCap size={13} className="text-sky-400" />
                <span>Alumni Directory Registration</span>
              </div>
              <h2 className="text-2xl font-black text-white">
                Register as an <span className="text-shimmer">Alumni Leader</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Former GSCSC leaders and executive members: submit your profile. Once reviewed by the central administration, your profile will be published live in the official Alumni &amp; Former Panels Directory.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Application Received!</h3>
                <p className="text-xs text-emerald-200">
                  Your alumni profile request has been sent to the Admin Panel. You will receive an update once verified.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sumit Saha"
                      value={applyForm.name}
                      onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-sky-500/25 text-white text-xs outline-none focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. dr.sumitsaha@example.com"
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-sky-500/25 text-white text-xs outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="017xxxxxxxx"
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-sky-500/25 text-white text-xs outline-none focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">HSC Batch *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HSC '2013"
                      value={applyForm.batch}
                      onChange={(e) => setApplyForm({ ...applyForm, batch: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-sky-500/25 text-white text-xs outline-none focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Blood Group</label>
                    <select
                      value={applyForm.blood}
                      onChange={(e) => setApplyForm({ ...applyForm, blood: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-sky-500/25 text-white text-xs outline-none focus:border-sky-400"
                    >
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Former Role in GSCSC</label>
                    <input
                      type="text"
                      placeholder="e.g. General Secretary, VP, Rocketry Lead"
                      value={applyForm.role_applied}
                      onChange={(e) => setApplyForm({ ...applyForm, role_applied: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-sky-500/25 text-white text-xs outline-none focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Undergrad / Higher Study</label>
                    <input
                      type="text"
                      placeholder="e.g. MBBS - DMC, CSE - BUET"
                      value={applyForm.institution}
                      onChange={(e) => setApplyForm({ ...applyForm, institution: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-sky-500/25 text-white text-xs outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Current Workplace &amp; Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer at Google, Senior Medical Officer"
                    value={applyForm.current_position}
                    onChange={(e) => setApplyForm({ ...applyForm, current_position: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-sky-500/25 text-white text-xs outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Note or Message to Club</label>
                  <textarea
                    rows={2}
                    placeholder="Share any achievements, memories, or contact notes..."
                    value={applyForm.statement}
                    onChange={(e) => setApplyForm({ ...applyForm, statement: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-sky-500/25 text-white text-xs outline-none focus:border-sky-400 resize-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary text-xs flex items-center gap-2 py-2.5 px-6 shadow-lg shadow-sky-500/25"
                  >
                    {submitting ? "Submitting..." : "Submit Alumni Profile"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
