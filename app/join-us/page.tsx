"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { submitJoinRequest } from "@/lib/supabase";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Banknote,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  X,
  Copy,
  Check,
  Smartphone
} from "lucide-react";
import { compressImageFile } from "@/lib/imageUtils";
import {
  getPaymentSettings,
  PaymentSettings,
  PaymentGateway,
  DEFAULT_PAYMENT_SETTINGS
} from "@/lib/paymentSettings";
import { getStoredDepartments, DepartmentItem, DEFAULT_DEPARTMENTS } from "@/lib/departments-data";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

type PaymentMethod = "bkash" | "nagad" | "rocket" | "cod";

export default function JoinUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash");
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [departmentsList, setDepartmentsList] = useState<DepartmentItem[]>(DEFAULT_DEPARTMENTS);

  // Load dynamic payment settings from admin panel & keep synced
  useEffect(() => {
    const loadSettings = () => {
      setPaymentSettings(getPaymentSettings());
    };
    loadSettings();
    window.addEventListener("gscsc_payment_settings_updated", loadSettings);
    window.addEventListener("storage", loadSettings);
    return () => {
      window.removeEventListener("gscsc_payment_settings_updated", loadSettings);
      window.removeEventListener("storage", loadSettings);
    };
  }, []);

  // Dynamically load departments added in Admin Panel
  useEffect(() => {
    const loadDepts = () => {
      const depts = getStoredDepartments();
      if (depts && depts.length > 0) {
        setDepartmentsList(depts);
      }
    };
    loadDepts();
    window.addEventListener("gscsc_departments_updated", loadDepts);
    window.addEventListener("storage", loadDepts);
    return () => {
      window.removeEventListener("gscsc_departments_updated", loadDepts);
      window.removeEventListener("storage", loadDepts);
    };
  }, []);

  // Filter only active gateways (must be enabled AND have a number, or be COD)
  const activeGateways = paymentSettings.gateways.filter((g) => {
    if (!g.enabled) return false;
    if (g.id === "cod") return true;
    return Boolean(g.number && g.number.trim().length > 0);
  });

  // Ensure selected paymentMethod is one of the active gateways
  useEffect(() => {
    if (activeGateways.length > 0) {
      const exists = activeGateways.some((g) => g.id === paymentMethod);
      if (!exists) {
        setPaymentMethod(activeGateways[0].id as PaymentMethod);
      }
    }
  }, [activeGateways, paymentMethod]);

  const selectedGateway = activeGateways.find((g) => g.id === paymentMethod) || activeGateways[0];

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college_roll: "",
    session: "2024-2025",
    role_applied: "General Member",
    department: DEFAULT_DEPARTMENTS[0]?.title || "Robotics & Rocketry",
    blood: "B+",
    photo: "",
    interest: "",
    trxId: "",
  });

  // Keep department selected in sync once departments list loads
  useEffect(() => {
    if (departmentsList.length > 0 && !form.department) {
      setForm((prev) => ({ ...prev, department: departmentsList[0].title }));
    }
  }, [departmentsList, form.department]);

  // Automatically prefill email if coming from Homepage Hero "Join Now"
  useEffect(() => {
    const applyPrefilledEmail = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const emailFromParam = params.get("email");
        const emailFromStorage = localStorage.getItem("gscsc_prefill_email") || sessionStorage.getItem("gscsc_prefill_email");
        const targetEmail = (emailFromParam || emailFromStorage || "").trim();
        if (targetEmail) {
          setForm((prev) => ({ ...prev, email: targetEmail }));
        }
      } catch {}
    };

    applyPrefilledEmail();
    const timer = setTimeout(applyPrefilledEmail, 150);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(text);
      } else {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopiedNumber(text);
      setTimeout(() => setCopiedNumber(null), 2500);
    } catch {
      alert("Please copy number manually: " + text);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const uri = await compressImageFile(file, 600, 800);
      setForm((prev) => ({ ...prev, photo: uri }));
    } catch (err) {
      alert((err as Error).message || "Failed to process photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const [honeypot, setHoneypot] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // WAF Malicious Payload Validator
  const validatePayload = (text: string): boolean => {
    const maliciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /union\s+select/gi,
      /drop\s+table/gi,
      /insert\s+into/gi,
      /<iframe/gi,
      /base64,/gi,
    ];
    return !maliciousPatterns.some((pattern) => pattern.test(text));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    // 1. Bot Honeypot Trap
    if (honeypot) {
      console.warn("WAF: Automated bot submission dropped.");
      setSubmitted(true);
      return;
    }

    // 2. Anti-Flooding Cooldown
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      setErrorMessage("Rate limit exceeded: Please wait 10 seconds before submitting again.");
      return;
    }

    // 3. WAF Injection Scanner
    const allText = `${form.name} ${form.email} ${form.phone} ${form.college_roll} ${form.interest} ${form.trxId}`;
    if (!validatePayload(allText)) {
      setErrorMessage("WAF Alert: Suspicious script or injection syntax detected and blocked.");
      return;
    }

    if (activeGateways.length > 0 && paymentMethod !== "cod" && !form.trxId.trim()) {
      setErrorMessage(`Please provide your ${selectedGateway ? selectedGateway.name : paymentMethod.toUpperCase()} Transaction ID (TrxID).`);
      return;
    }

    setErrorMessage("");
    setLastSubmitTime(now);
    setLoading(true);
    try {
      const paymentInfo = activeGateways.length > 0 
        ? ` | Payment: ${paymentMethod.toUpperCase()}${form.trxId ? ` | TrxID: ${form.trxId}` : ""}`
        : "";
      await submitJoinRequest({
        name: form.name,
        email: form.email,
        phone: form.phone,
        college_roll: form.college_roll,
        session: form.session,
        role_applied: form.role_applied,
        departments: [form.department],
        blood: form.blood,
        photo: form.photo,
        interest: `${form.interest}${paymentInfo}`,
      });
      // Clear prefilled storage once successfully submitted
      try {
        localStorage.removeItem("gscsc_prefill_email");
      } catch {}
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles: React.CSSProperties = {
    width: "100%",
    background: "rgba(15, 23, 42, 0.65)",
    border: "1px solid rgba(56, 189, 248, 0.25)",
    borderRadius: 12,
    padding: "12px 16px",
    color: "#fff",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-24 px-3 sm:px-6 max-w-[800px] mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/40 hover:bg-slate-800/60 border border-sky-500/20 text-xs text-sky-300 font-medium backdrop-blur-md transition-all"
        >
          <ArrowLeft size={14} />
          Back to Homepage
        </Link>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 flex flex-col items-center justify-center">
        {/* Centered Top Logo */}
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

        {/* Badge on its own line below logo */}
        <div className="flex justify-center mb-3 w-full">
          <span className="text-sky-400 text-xs font-mono font-bold uppercase tracking-widest block">
            NEW MEMBER REGISTRATION
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
          Join Govt. Science College Science Club
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2">
          Embark on an extraordinary journey of innovation, research, national competitions, and lifelong fellowship.
        </p>
      </div>

      <div
        className="rounded-3xl p-6 sm:p-10 border border-sky-500/25"
        style={{
          background: "rgba(6, 14, 34, 0.55)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.5), 0 0 25px rgba(56,189,248,0.1)",
        }}
      >
        {submitted ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">
              Registration Received!
            </h2>
            <p className="text-slate-200 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Welcome to the GSCSC family, <strong className="text-white">{form.name}</strong>. Your application has been logged. Our executive committee will verify your college enrollment and contact you with orientation schedules.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  college_roll: "",
                  session: "2024-2025",
                  role_applied: "General Member",
                  department: departmentsList[0]?.title || DEFAULT_DEPARTMENTS[0]?.title || "",
                  blood: "B+",
                  photo: "",
                  interest: "",
                  trxId: "",
                });
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-sky-400/30 text-white text-xs font-semibold transition-all"
            >
              Submit Another Application
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Invisible Honeypot Bot Trap */}
            <input
              type="text"
              name="company_website_trap"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ display: "none", position: "absolute", left: "-9999px" }}
            />

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                {errorMessage}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-sky-400 mb-1.5">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Your official full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyles}
                  className="focus:border-sky-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyles}
                  className="focus:border-sky-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-sky-400 mb-1.5">
                  Contact Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="017XXXXXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={inputStyles}
                  className="focus:border-sky-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-400 mb-1.5">
                  College Roll / Student ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 241005"
                  value={form.college_roll}
                  onChange={(e) => setForm({ ...form, college_roll: e.target.value })}
                  style={inputStyles}
                  className="focus:border-sky-400 transition-colors"
                />
              </div>
            </div>

            {/* Department & Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-sky-400 mb-1.5">
                  Preferred Department (Select Wing) *
                </label>
                <select
                  required
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  style={{
                    ...inputStyles,
                    cursor: "pointer",
                    backgroundColor: "#0b1528",
                  }}
                  className="focus:border-sky-400 transition-colors"
                >
                  {departmentsList.map((d, idx) => (
                    <option key={d.id || idx} value={d.title} className="bg-[#0b1528] text-white">
                      {d.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-sky-400 mb-1.5">
                  Blood Group
                </label>
                <select
                  value={form.blood}
                  onChange={(e) => setForm({ ...form, blood: e.target.value })}
                  style={{
                    ...inputStyles,
                    cursor: "pointer",
                    backgroundColor: "#0b1528",
                  }}
                  className="focus:border-sky-400 transition-colors"
                >
                  {BLOOD_GROUPS.map((b) => (
                    <option key={b} value={b} className="bg-[#0b1528] text-white">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Profile Photo Upload */}
            <div className="p-4 rounded-2xl border border-sky-500/20 bg-slate-950/60 flex flex-col sm:flex-row items-center gap-4">
              {form.photo ? (
                <div className="relative w-20 h-24 rounded-xl overflow-hidden border border-sky-400/50 shadow-md flex-shrink-0">
                  <img src={form.photo} alt="Applicant preview" className="w-full h-full object-cover object-top" />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, photo: "" }))}
                    className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition-colors"
                    title="Remove photo"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-24 rounded-xl border border-dashed border-sky-500/30 bg-sky-500/5 flex flex-col items-center justify-center text-sky-400 flex-shrink-0">
                  <ImageIcon size={22} className="opacity-60" />
                  <span className="text-[10px] text-slate-400 mt-1">No Photo</span>
                </div>
              )}

              <div className="flex-1 text-center sm:text-left">
                <div className="text-xs font-bold text-white mb-0.5">Applicant Profile Photo (Optional)</div>
                <p className="text-[11px] text-slate-400 leading-tight mb-2.5">
                  Upload your formal photo for your official club membership application.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Upload size={13} />
                  <span>{uploadingPhoto ? "Compressing..." : form.photo ? "Change Photo" : "Upload from Mobile / PC"}</span>
                </button>
              </div>
            </div>

            {/* Why do you want to join */}
            <div>
              <label className="block text-xs font-bold text-sky-400 mb-1.5">
                Why do you want to join GSCSC?
              </label>
              <textarea
                rows={3}
                placeholder="Tell us about your interests, past competitions, coding or rocketry interests..."
                value={form.interest}
                onChange={(e) => setForm({ ...form, interest: e.target.value })}
                style={inputStyles}
                className="resize-none focus:border-sky-400 transition-colors"
              />
            </div>

            {/* Payment Method Section (Only displayed if admin has enabled gateways with numbers or COD) */}
            {activeGateways.length > 0 && (
              <div className="pt-3 border-t border-sky-500/20">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-sky-400 block">
                    Registration Fee Payment Method *
                  </label>
                  <span className="text-[11px] text-emerald-400 font-mono font-bold">
                    Fee: {selectedGateway ? selectedGateway.fee : "100 BDT"}
                  </span>
                </div>

                {/* Dynamically active payment options from admin panel */}
                <div className={`grid gap-2.5 mb-4 ${
                  activeGateways.length === 1
                    ? "grid-cols-1"
                    : activeGateways.length === 2
                    ? "grid-cols-2"
                    : activeGateways.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-4"
                }`}>
                  {activeGateways.map((gw) => {
                    const isSelected = paymentMethod === gw.id;
                    const isBkash = gw.id === "bkash";
                    const isNagad = gw.id === "nagad";
                    const isRocket = gw.id === "rocket";
                    const isCod = gw.id === "cod";

                    const activeBorderClass = isBkash
                      ? "border-pink-500 bg-pink-950/40 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                      : isNagad
                      ? "border-orange-500 bg-orange-950/40 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                      : isRocket
                      ? "border-purple-500 bg-purple-950/40 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                      : "border-sky-500 bg-sky-950/40 text-white shadow-[0_0_20px_rgba(56,189,248,0.3)]";

                    const iconColorClass = isBkash
                      ? "bg-pink-500/20 text-pink-400"
                      : isNagad
                      ? "bg-orange-500/20 text-orange-400"
                      : isRocket
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-sky-500/20 text-sky-400";

                    return (
                      <button
                        key={gw.id}
                        type="button"
                        onClick={() => setPaymentMethod(gw.id as PaymentMethod)}
                        className={`p-3 rounded-2xl border flex flex-col items-start gap-1 transition-all text-left ${
                          isSelected
                            ? activeBorderClass
                            : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColorClass}`}>
                          {isCod ? <Banknote size={15} /> : <Smartphone size={15} />}
                        </div>
                        <div className="text-xs font-bold text-white mt-1">{gw.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {isCod ? "Club Room" : `${gw.accountType}`}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Digital Payment Details with Copy Button */}
                {selectedGateway && selectedGateway.id !== "cod" ? (
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border space-y-3 mb-2 animate-fadeInMenu transition-colors ${
                      selectedGateway.id === "bkash"
                        ? "bg-pink-950/25 border-pink-500/40"
                        : selectedGateway.id === "nagad"
                        ? "bg-orange-950/25 border-orange-500/40"
                        : "bg-purple-950/25 border-purple-500/40"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                      <div>
                        <div className="text-xs font-bold text-white capitalize flex items-center gap-1.5">
                          <Smartphone
                            size={14}
                            className={
                              selectedGateway.id === "bkash"
                                ? "text-pink-400"
                                : selectedGateway.id === "nagad"
                                ? "text-orange-400"
                                : "text-purple-400"
                            }
                          />
                          <span>{selectedGateway.name} {selectedGateway.accountType} Number</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          {selectedGateway.instructions || (
                            <>
                              Send <strong className="text-white">{selectedGateway.fee}</strong> via Send Money
                            </>
                          )}
                        </p>
                      </div>

                      {/* Dynamic Copy Number Box */}
                      {selectedGateway.number && (
                        <div className="flex items-center gap-2">
                          <div
                            onClick={() => copyToClipboard(selectedGateway.number)}
                            title="Click to copy"
                            className="cursor-pointer font-mono font-black text-sm sm:text-base text-white px-3.5 py-1.5 rounded-xl bg-black/60 border border-white/20 select-all tracking-wider hover:border-cyan-400 transition-colors"
                          >
                            {selectedGateway.number}
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(selectedGateway.number)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                              copiedNumber === selectedGateway.number
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                            }`}
                          >
                            {copiedNumber === selectedGateway.number ? (
                              <>
                                <Check size={13} className="text-slate-950" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5">
                        {selectedGateway.name} Transaction ID (TrxID) *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={`Enter ${selectedGateway.name} TrxID (e.g. 9B8A7C6D5E)`}
                        value={form.trxId}
                        onChange={(e) => setForm({ ...form, trxId: e.target.value.toUpperCase() })}
                        style={{
                          ...inputStyles,
                          border: "1px solid rgba(56, 189, 248, 0.4)",
                          background: "rgba(10, 15, 30, 0.7)",
                        }}
                        className="font-mono tracking-wider placeholder-slate-500 focus:border-cyan-400"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 text-xs text-sky-200 leading-relaxed mb-2 animate-fadeInMenu">
                    {selectedGateway?.instructions || (
                      <>
                        You can pay the <strong className="text-white">{selectedGateway?.fee || "100 BDT"}</strong> membership registration fee directly in cash at the{" "}
                        <strong className="text-white">GSCSC Club Room / Registration Booth</strong> during delegate orientation.
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-[0_0_25px_rgba(56,189,248,0.5)] border border-sky-300/40"
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
              }}
            >
              <span>{loading ? "Submitting Application..." : "Submit Registration Application"}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
