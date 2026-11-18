"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Check,
  Save,
  Smartphone,
  Banknote,
  Sparkles,
  Copy,
  AlertCircle,
  Eye,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import {
  PaymentSettings,
  PaymentGateway,
  DEFAULT_PAYMENT_SETTINGS,
  getPaymentSettings,
  savePaymentSettings
} from "@/lib/paymentSettings";

export default function AdminPaymentSettings() {
  const [settings, setSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  useEffect(() => {
    setSettings(getPaymentSettings());
  }, []);

  const handleGatewayChange = (
    id: string,
    field: keyof PaymentGateway,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      gateways: prev.gateways.map((g) =>
        g.id === id ? { ...g, [field]: value } : g
      ),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDefaults = () => {
    if (!confirm("Reset all payment gateways to default settings?")) return;
    setSettings(DEFAULT_PAYMENT_SETTINGS);
    savePaymentSettings(DEFAULT_PAYMENT_SETTINGS);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const copyTest = (num: string) => {
    if (!num) return;
    if (navigator.clipboard) navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const activeGateways = settings.gateways.filter((g) => {
    if (!g.enabled) return false;
    if (g.id === "cod") return true;
    return g.number && g.number.trim().length > 0;
  });

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <CreditCard size={24} className="text-cyan-400" />
            Payment Gateways &amp; Merchant Settings
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Configure bKash, Nagad, Rocket merchant/personal numbers and fees. If a number is empty or disabled, it will automatically be hidden from the public registration form.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={14} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="btn-primary text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            {saved ? <Check size={15} className="text-emerald-300" /> : <Save size={15} />}
            <span>{saved ? "Saved to Live Site!" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Gateways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {settings.gateways.map((gw) => {
            const isDigital = gw.id !== "cod";

            return (
              <div
                key={gw.id}
                className={`p-5 rounded-3xl border transition-all ${
                  gw.enabled
                    ? gw.id === "bkash"
                      ? "border-pink-500/40 bg-pink-950/20 shadow-xl shadow-pink-950/30"
                      : gw.id === "nagad"
                      ? "border-orange-500/40 bg-orange-950/20 shadow-xl shadow-orange-950/30"
                      : gw.id === "rocket"
                      ? "border-purple-500/40 bg-purple-950/20 shadow-xl shadow-purple-950/30"
                      : "border-sky-500/40 bg-sky-950/20 shadow-xl shadow-sky-950/30"
                    : "border-slate-800 bg-slate-900/40 opacity-70"
                }`}
              >
                {/* Gateway Card Top */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-md ${
                        gw.id === "bkash"
                          ? "bg-pink-500/20 text-pink-400 border border-pink-400/30"
                          : gw.id === "nagad"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-400/30"
                          : gw.id === "rocket"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-400/30"
                          : "bg-sky-500/20 text-sky-400 border border-sky-400/30"
                      }`}
                    >
                      {isDigital ? <Smartphone size={18} /> : <Banknote size={18} />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        {gw.name}
                        {gw.enabled && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            Active
                          </span>
                        )}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {isDigital ? `${gw.accountType} Account` : "In-Person Cash"}
                      </span>
                    </div>
                  </div>

                  {/* Enable / Disable Toggle Switch */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-xs font-semibold text-slate-300">
                      {gw.enabled ? "Enabled" : "Disabled"}
                    </span>
                    <input
                      type="checkbox"
                      checked={gw.enabled}
                      onChange={(e) => handleGatewayChange(gw.id, "enabled", e.target.checked)}
                      className="hidden"
                    />
                    <div
                      className={`w-11 h-6 rounded-full p-1 transition-colors ${
                        gw.enabled ? "bg-cyan-400" : "bg-slate-700"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                          gw.enabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </label>
                </div>

                {/* Gateway Inputs */}
                <div className="space-y-3.5">
                  {isDigital ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Account Type (Personal / Merchant / Agent) */}
                        <div>
                          <label className="text-slate-300 text-xs mb-1 block font-semibold">
                            Account Type
                          </label>
                          <select
                            value={gw.accountType}
                            onChange={(e) =>
                              handleGatewayChange(gw.id, "accountType", e.target.value)
                            }
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400"
                          >
                            <option value="Personal">Personal (Send Money)</option>
                            <option value="Merchant">Merchant (Payment / QR)</option>
                            <option value="Agent">Agent (Cash In / Out)</option>
                          </select>
                        </div>

                        {/* Fee Amount */}
                        <div>
                          <label className="text-slate-300 text-xs mb-1 block font-semibold">
                            Registration Fee
                          </label>
                          <input
                            type="text"
                            value={gw.fee}
                            onChange={(e) => handleGatewayChange(gw.id, "fee", e.target.value)}
                            placeholder="e.g. 100 BDT"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400 font-mono"
                          />
                        </div>
                      </div>

                      {/* Number Input (Crucial) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-slate-300 text-xs font-semibold">
                            {gw.name} Phone / Account Number *
                          </label>
                          <span className="text-[10px] text-slate-400">
                            Leave blank to hide from registration form
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="tel"
                            value={gw.number}
                            onChange={(e) => handleGatewayChange(gw.id, "number", e.target.value)}
                            placeholder="e.g. 01956477266"
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs font-bold outline-none focus:border-cyan-400 tracking-wider"
                          />
                          {gw.number && (
                            <button
                              type="button"
                              onClick={() => copyTest(gw.number)}
                              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Test Copy"
                            >
                              {copiedNumber === gw.number ? (
                                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                                  <Check size={12} /> Copied
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Copy size={12} /> Copy
                                </span>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="text-slate-300 text-xs mb-1 block font-semibold">
                        Cash on Spot Fee Amount
                      </label>
                      <input
                        type="text"
                        value={gw.fee}
                        onChange={(e) => handleGatewayChange(gw.id, "fee", e.target.value)}
                        placeholder="e.g. 100 BDT"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400 font-mono"
                      />
                    </div>
                  )}

                  {/* Instructions */}
                  <div>
                    <label className="text-slate-300 text-xs mb-1 block font-semibold">
                      Public Instructions / Note for Applicants
                    </label>
                    <textarea
                      rows={2}
                      value={gw.instructions || ""}
                      onChange={(e) =>
                        handleGatewayChange(gw.id, "instructions", e.target.value)
                      }
                      placeholder="Instructions shown to the student when this payment method is selected..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Preview Card */}
        <div className="glass-card p-6 border-cyan-500/25 rounded-3xl shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={16} className="text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Live Registration Form Preview (/join-us)
            </h3>
          </div>
          <p className="text-slate-400 text-xs mb-4">
            This is exactly how applicants will see the payment options on the registration page:
          </p>

          {activeGateways.length === 0 ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>
                <strong>No active payment methods configured!</strong> The registration form will submit directly without requiring any payment fee or TrxID.
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>Select Payment Method:</span>
                <span className="text-emerald-400 font-mono">
                  {activeGateways[0]?.fee || "100 BDT"}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {activeGateways.map((gw) => (
                  <div
                    key={gw.id}
                    className="p-2.5 rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-white text-left"
                  >
                    <div className="font-bold text-xs">{gw.name}</div>
                    <div className="text-[10px] text-cyan-300 font-mono mt-0.5">
                      {gw.id === "cod" ? "Club Room" : `${gw.accountType} (${gw.number})`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn-primary text-xs flex items-center gap-2 px-6 py-3 shadow-xl shadow-cyan-500/25"
          >
            {saved ? <Check size={16} className="text-emerald-300" /> : <Save size={16} />}
            <span>{saved ? "Settings Saved Successfully!" : "Save Payment Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
