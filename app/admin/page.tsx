"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authenticateAdmin, setAdminSession } from "@/lib/adminAuth";
import { Lock, User, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await new Promise((r) => setTimeout(r, 400));

    const authUser = authenticateAdmin(form.username, form.password);

    if (authUser) {
      setAdminSession(authUser);
      router.push("/admin/dashboard");
    } else {
      setError("Invalid username or password. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #050b1c 0%, #030712 60%, #02040a 100%)" }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-8 sm:p-10 border border-cyan-500/25"
        style={{
          background: "rgba(6, 14, 34, 0.92)",
          backdropFilter: "blur(32px)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(56,189,248,0.12)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 p-1 border-2 border-sky-400/50 shadow-[0_0_25px_rgba(56,189,248,0.4)] bg-slate-900/60 backdrop-blur-md">
            <img
              src="/logo.png"
              alt="GSCSC Official Logo"
              width={80}
              height={80}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin &amp; Staff Access</h1>
          <p className="text-xs text-sky-400 font-mono mt-1">GSCSC Control Center &bull; Est. 1981</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-medium animate-fadeIn">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sky-400 mb-2">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Enter admin or staff username"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sky-400 mb-2">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPass ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all transform hover:brightness-110 active:scale-[0.99] disabled:opacity-60 shadow-[0_0_25px_rgba(56,189,248,0.4)]"
            style={{ background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)" }}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-500 mt-6">
          Authorized personnel only. Sessions expire after 12 hours.
        </p>
      </div>
    </div>
  );
}
