"use client";

import React, { useState, useEffect } from "react";
import { getAdminUser, AdminUser } from "@/lib/adminAuth";
import {
  getSiteLockdownState,
  setSiteLockdownState,
  fetchCloudSiteLockdownState,
  LOCKDOWN_EVENT,
} from "@/lib/siteMode";
import { ShieldAlert, ShieldCheck, Power, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function AdminLockdownToggle() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [lockdown, setLockdown] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check authenticated user role
    const user = getAdminUser();
    setCurrentUser(user);

    // Initial state
    setLockdown(getSiteLockdownState());

    // Fetch latest state from Cloudflare KV
    fetchCloudSiteLockdownState().then((state) => {
      setLockdown(state);
    });

    const handleLockdownEvent = (e: any) => {
      if (e?.detail?.enabled !== undefined) {
        setLockdown(e.detail.enabled);
      } else {
        setLockdown(getSiteLockdownState());
      }
    };

    window.addEventListener(LOCKDOWN_EVENT, handleLockdownEvent);
    return () => window.removeEventListener(LOCKDOWN_EVENT, handleLockdownEvent);
  }, []);

  // MANDATORY SECURITY RULE:
  // "administator er jonno only eikhane on/ off button deo just for administrator.
  // normal admin or stuff jeno dekha nah pay button ta !"
  if (currentUser?.role !== "administrator") {
    return null;
  }

  const handleToggle = (nextState: boolean) => {
    setSiteLockdownState(nextState, currentUser?.name || "Jim (Administrator)");
    setLockdown(nextState);

    if (nextState) {
      setToastMessage("Lockdown Mode ACTIVE: All public pages now show 404, Homepage shows /developer.");
    } else {
      setToastMessage("Lockdown Mode OFF: All public pages restored to normal & visible.");
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="w-full mb-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={`mb-3 p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            lockdown
              ? "bg-rose-500/20 border-rose-500/50 text-rose-200"
              : "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
          }`}
        >
          {lockdown ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Prominent Administrator Top Bar with ON / OFF Switch */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border backdrop-blur-2xl transition-all shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          lockdown
            ? "border-rose-500/60 bg-rose-950/60 shadow-[0_0_25px_rgba(244,63,94,0.3)]"
            : "border-sky-500/30 bg-slate-900/80 shadow-black/60"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 transition-colors ${
              lockdown
                ? "bg-rose-500/25 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                : "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
            }`}
          >
            {lockdown ? <ShieldAlert size={22} className="animate-pulse" /> : <ShieldCheck size={22} />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-cyan-400">
                ★ Administrator System Control
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wide border ${
                  lockdown
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                }`}
              >
                {lockdown ? "Lockdown: ACTIVE (404 Mode)" : "Site Status: LIVE (Normal)"}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {lockdown ? (
                <span>
                  <strong className="text-white">Emergency Lockdown Mode is ON.</strong> All public pages return 404 (Not Found). Homepage (/) is displaying the /developer page.
                </span>
              ) : (
                <span>
                  <strong className="text-white">Normal Mode.</strong> All public pages are visible, accessible, and operating normally.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Big Interactive ON / OFF Switch */}
        <div className="flex items-center gap-3 self-end sm:self-center shrink-0 bg-slate-950/70 p-2 sm:p-2.5 rounded-2xl border border-white/10">
          <span className="text-xs font-bold text-slate-300 hidden md:inline">
            Lockdown:
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={lockdown}
            onClick={() => handleToggle(!lockdown)}
            className={`relative inline-flex h-9 w-18 items-center rounded-full transition-all focus:outline-none cursor-pointer p-1 ${
              lockdown
                ? "bg-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.7)]"
                : "bg-slate-700 hover:bg-slate-600"
            }`}
            style={{ width: "68px" }}
          >
            <span
              className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out flex items-center justify-center ${
                lockdown ? "translate-x-7" : "translate-x-0"
              }`}
            >
              <Power size={14} className={lockdown ? "text-rose-600" : "text-slate-600"} />
            </span>
          </button>

          <span
            className={`text-sm font-black font-mono tracking-wider min-w-[32px] text-center ${
              lockdown ? "text-rose-400" : "text-slate-400"
            }`}
          >
            {lockdown ? "ON" : "OFF"}
          </span>
        </div>
      </div>
    </div>
  );
}
