import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-24 px-4 sm:px-6 max-w-[900px] mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-sky-400 text-xs font-bold uppercase tracking-widest block mb-2">
          LEGAL & TRUST
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
          How Govt. Science College Science Club protects and manages member and delegate data.
        </p>
      </div>

      <div className="rounded-3xl p-8 border border-white/10 space-y-6 text-sm text-white/75 leading-relaxed" style={{ background: "rgba(18, 14, 28, 0.65)", backdropFilter: "blur(20px)" }}>
        <div>
          <h2 className="text-lg font-bold text-white mb-2">1. Information We Collect</h2>
          <p>We collect names, emails, phone numbers, and institutional affiliations submitted via registration and contact forms.</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white mb-2">2. How We Use Information</h2>
          <p>Data is exclusively used for competition certifications, festival entry passes, and direct communication.</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white mb-2">3. Data Protection</h2>
          <p>We do not sell, rent, or distribute student information to third-party commercial marketing firms.</p>
        </div>
      </div>
    </main>
  );
}
