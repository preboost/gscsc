import React from "react";

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-24 px-4 sm:px-6 max-w-[900px] mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-sky-400 text-xs font-bold uppercase tracking-widest block mb-2">
          RULES & CONDUCT
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Terms of Services
        </h1>
        <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
          Terms and guidelines governing club membership, events, and intellectual property.
        </p>
      </div>

      <div className="rounded-3xl p-8 border border-white/10 space-y-6 text-sm text-white/75 leading-relaxed" style={{ background: "rgba(18, 14, 28, 0.65)", backdropFilter: "blur(20px)" }}>
        <div>
          <h2 className="text-lg font-bold text-white mb-2">1. Membership Eligibility</h2>
          <p>Active membership is open to currently enrolled students of Govt. Science College, Dhaka.</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white mb-2">2. Code of Conduct &amp; Fair Play</h2>
          <p>Delegates in festivals must adhere to academic integrity, fairness, and mutual respect.</p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white mb-2">3. Intellectual Property</h2>
          <p>Innovations, projects, and research papers developed under club initiatives remain the intellectual property of the student inventors.</p>
        </div>
      </div>
    </main>
  );
}
