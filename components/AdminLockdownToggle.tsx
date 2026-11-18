"use client";

import React, { useState, useEffect } from "react";
import { getAdminUser, AdminUser } from "@/lib/adminAuth";
import {
  getSiteLockdownState,
  setSiteLockdownState,
  fetchCloudSiteLockdownState,
  LOCKDOWN_EVENT,
} from "@/lib/siteMode";
import { ShieldAlert, ShieldCheck, Power, AlertTriangle, X, CheckCircle2 } from "lucide-react";

export default function AdminLockdownToggle() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [lockdown, setLockdown] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    // Check authenticated user role
    const user = getAdminUser();
    setCurrentUser(user);

    // Initial state
    setLockdown(getSiteLockdownState());

    // Fetch KV Cloud state
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
    setSaving(true);
    setSiteLockdownState(nextState, currentUser?.name || "Jim (Administrator)");
    setLockdown(nextState);
    setTimeout(() => {
      setSaving(false);
      setShowModal(false);
    }, 400);
  };

  return (
    <>
      {/* On / Off Button strictly for Administrator */}
      <div className="flex items-center">
        {lockdown ? (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-rose-500/60 bg-rose-950/70 hover:bg-rose-900/80 text-rose-200 text-xs font-bold transition-all shadow-[0_0_18px_rgba(244,63,94,0.45)] cursor-pointer group"
            title="Lockdown Active: All pages return 404, Homepage shows /developer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span className="hidden md:inline font-mono text-[11px] text-rose-300">Lockdown:</span>
            <span className="text-white font-extrabold">ON (404 Active)</span>
            <div className="w-8 h-4 rounded-full bg-rose-600 p-0.5 transition-colors flex items-center justify-end">
              <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
            </div>
          </button>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold transition-all shadow-sm cursor-pointer group"
            title="Normal Mode: Site is live & visible (Click to switch to Lockdown)"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="hidden md:inline text-slate-300">Site Mode:</span>
            <span className="text-emerald-400 font-bold">Live</span>
            <div className="w-8 h-4 rounded-full bg-slate-800 p-0.5 transition-colors border border-slate-700 flex items-center">
              <div className="w-3 h-3 rounded-full bg-slate-400" />
            </div>
          </button>
        )}
      </div>

      {/* Confirmation & Safety Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border border-sky-500/40 bg-slate-950 p-6 sm:p-7 shadow-2xl shadow-sky-500/20 text-left">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                  lockdown
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "bg-rose-500/15 border-rose-500/40 text-rose-400"
                }`}
              >
                {lockdown ? <ShieldCheck size={22} /> : <ShieldAlert size={22} />}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold">
                  Administrator Control
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {lockdown ? "Restore Normal Live Website?" : "Activate Emergency Lockdown Mode?"}
                </h3>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2 mb-6">
              {lockdown ? (
                <>
                  <p className="text-emerald-300 font-semibold">
                    Turning OFF Lockdown Mode will:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    <li>Restore all public pages (/about, /events, /contact, etc.) to normal and visible.</li>
                    <li>Restore the standard homepage.</li>
                    <li>Site returns to fully operational status.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p className="text-rose-300 font-semibold">
                    Turning ON Lockdown Mode will:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    <li>Make <strong>all pages return 404 (Not Found)</strong>.</li>
                    <li>Homepage (/) will show the <strong>/developer</strong> page.</li>
                    <li><strong>Admin Portal (/admin)</strong> remains completely accessible to you so you can turn it off anytime.</li>
                  </ul>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>

              {lockdown ? (
                <button
                  onClick={() => handleToggle(false)}
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                >
                  {saving ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  <span>Turn OFF &amp; Restore Live Site</span>
                </button>
              ) : (
                <button
                  onClick={() => handleToggle(true)}
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5"
                >
                  {saving ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Power size={14} />
                  )}
                  <span>Turn ON Lockdown Mode</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
