"use client";

import React, { useState } from "react";
import Image from "next/image";
import { submitContactMessage } from "@/lib/supabase";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Info,
  CheckCircle2,
  ArrowRight,
  Send,
} from "lucide-react";
import { getStoredContactSettings, DEFAULT_CONTACT_SETTINGS, ContactSettings } from "@/lib/contact-data";

export default function ContactPage() {
  const [contactSettings, setContactSettings] = useState<ContactSettings>(DEFAULT_CONTACT_SETTINGS);

  React.useEffect(() => {
    const load = () => {
      setContactSettings(getStoredContactSettings());
    };
    load();
    window.addEventListener("gscsc_contact_settings_updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("gscsc_contact_settings_updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Application Firewall Validation
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
    if (!formData.name || !formData.email || !formData.message) return;

    // 1. Bot Honeypot Trap
    if (honeypot) {
      console.warn("WAF: Automated bot detected and dropped.");
      setFormState("success");
      return;
    }

    // 2. Anti-Flooding Rate Limiting (10 second cooldown)
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      setFormState("error");
      setErrorMessage("Rate limit exceeded: Please wait 10 seconds before submitting again.");
      return;
    }

    // 3. WAF Injection Scanner
    const allText = `${formData.name} ${formData.email} ${formData.subject} ${formData.message}`;
    if (!validatePayload(allText)) {
      setFormState("error");
      setErrorMessage("WAF Alert: Suspicious script or SQL pattern detected and blocked.");
      return;
    }

    setLastSubmitTime(now);
    setFormState("loading");
    try {
      const res = await submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || undefined,
        message: formData.message,
      });

      if (res.success) {
        setFormState("success");
      } else {
        setFormState("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch {
      setFormState("success");
    }
  };

  const inputStyles: React.CSSProperties = {
    width: "100%",
    background: "rgba(10, 18, 38, 0.6)",
    border: "1px solid rgba(56, 189, 248, 0.2)",
    borderRadius: 10,
    padding: "11px 14px",
    color: "#fff",
    fontSize: "0.88rem",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <main className="subpage-main min-h-screen pt-8 sm:pt-12 pb-24 px-3 sm:px-6 max-w-[1150px] mx-auto">
      {/* Header with Official GSCSC Logo */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 flex flex-col items-center justify-center">
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
        <div className="flex justify-center mb-2 w-full">
          <span className="text-sky-400 text-xs font-mono font-bold uppercase tracking-widest block">
            GET IN TOUCH
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
          Contact <span className="text-shimmer">GSCSC</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed px-2">
          Have questions about our events, want to partner, or need assistance? Reach out to our organizing team.
        </p>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column: Official Contact Channels */}
        <div className="glass-card p-6 sm:p-10 border-cyan-500/25">
          <div className="flex items-center gap-2 mb-6 text-cyan-400">
            <Phone size={18} />
            <h2 className="text-lg font-bold text-cyan-400">
              Official Contact Channels
            </h2>
          </div>

          <div className="space-y-6">
            {/* Campus Address */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-[0.7rem] uppercase font-bold tracking-wider text-cyan-400/80 block mb-0.5">
                  Campus Address
                </span>
                <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
                  {contactSettings.address}
                </p>
                {contactSettings.room && (
                  <p className="text-cyan-400 text-xs font-mono mt-0.5">
                    {contactSettings.room}
                  </p>
                )}
              </div>
            </div>

            {/* Official Email */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <span className="text-[0.7rem] uppercase font-bold tracking-wider text-cyan-400/80 block mb-0.5">
                  Official Email
                </span>
                <p className="space-x-2">
                  <a
                    href={`mailto:${contactSettings.email1}`}
                    className="text-slate-200 text-xs sm:text-sm font-medium hover:text-cyan-400 transition-colors"
                  >
                    {contactSettings.email1}
                  </a>
                  {contactSettings.email2 && (
                    <>
                      <span className="text-slate-500">&bull;</span>
                      <a
                        href={`mailto:${contactSettings.email2}`}
                        className="text-slate-200 text-xs sm:text-sm font-medium hover:text-cyan-400 transition-colors"
                      >
                        {contactSettings.email2}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Phone Lines */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <span className="text-[0.7rem] uppercase font-bold tracking-wider text-cyan-400/80 block mb-0.5">
                  Phone Lines
                </span>
                <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed space-x-2">
                  <a href={`tel:${contactSettings.phone1}`} className="hover:text-cyan-400 transition-colors font-mono">
                    {contactSettings.phone1}
                  </a>
                  {contactSettings.phone2 && (
                    <>
                      <span className="text-slate-500">,</span>
                      <a href={`tel:${contactSettings.phone2}`} className="hover:text-cyan-400 transition-colors font-mono">
                        {contactSettings.phone2}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Office Hours */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-[0.7rem] uppercase font-bold tracking-wider text-cyan-400/80 block mb-0.5">
                  Office Hours
                </span>
                <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
                  {contactSettings.hours}
                </p>
              </div>
            </div>
          </div>

          {/* Social / Direct Notice */}
          <div className="mt-8 pt-6 border-t border-cyan-500/15 flex items-start gap-2.5 text-xs text-slate-300">
            <Info size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <p>
              For quick event responses, you can also reach us via our{" "}
              <a
                href="https://www.facebook.com/share/16o39tqLqv/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 font-semibold hover:underline"
              >
                Facebook Page
              </a>
              .
            </p>
          </div>
        </div>

        {/* Right Column: Send Us a Message Form */}
        <div className="glass-card p-6 sm:p-10 border-cyan-500/25">
          <h2 className="text-lg font-bold text-white mb-6">Send Us a Message</h2>

          {formState === "success" ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Message Received!</h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                Thank you for reaching out to GSCSC. Our executive secretariat will get back to you within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFormState("idle");
                  setFormData({ name: "", email: "", subject: "", message: "" });
                }}
                className="btn-primary text-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Invisible Honeypot Bot Trap */}
              <input
                type="text"
                name="website_url_hp"
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
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={inputStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={inputStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Message <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    ...inputStyles,
                    resize: "none",
                  }}
                />
              </div>

              {formState === "error" && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={formState === "loading"}
                className="btn-primary w-full justify-center mt-2 disabled:opacity-50"
              >
                {formState === "loading" ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
