"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminGetDashboardStats } from "@/lib/adminSupabase";
import {
  MessageSquare,
  UserPlus,
  Calendar,
  Trophy,
  Shield,
  TrendingUp,
  Users,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Globe,
  Database,
  Award,
  GraduationCap,
  CreditCard,
  Layers,
  FlaskConical,
  Microscope,
  FileText,
  Phone,
  Rocket,
  Images
} from "lucide-react";

interface Stats {
  contactMessages: number;
  joinRequests: number;
  events: number;
  ambassadors: number;
  executives: number;
  alumni: number;
  moderators: number;
}

const QUICK_LINKS = [
  { href: "/admin/database", label: "Database & Backup", icon: Database, color: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-400/40", text: "text-cyan-400", stat: "alumni" },
  { href: "/admin/join-requests", label: "Join Requests", icon: UserPlus, color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30", text: "text-emerald-400", stat: "joinRequests" },
  { href: "/admin/payments", label: "Payment Gateways", icon: CreditCard, color: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/30", text: "text-pink-400" },
  { href: "/admin/departments", label: "Departments / Wings", icon: Layers, color: "from-cyan-500/20 to-sky-500/20", border: "border-cyan-400/40", text: "text-cyan-300" },
  { href: "/admin/slide-pics", label: "Slide Pics (Gallery)", icon: Images, color: "from-sky-500/20 to-teal-500/20", border: "border-sky-400/40", text: "text-sky-300" },
  { href: "/admin/workshops", label: "Club Workshops", icon: FlaskConical, color: "from-emerald-500/20 to-cyan-500/20", border: "border-emerald-400/40", text: "text-emerald-300" },
  { href: "/admin/projects", label: "Research & Projects", icon: Microscope, color: "from-blue-500/20 to-indigo-500/20", border: "border-blue-400/40", text: "text-blue-300" },
  { href: "/admin/falcon", label: "GSC Falcon Rocketry", icon: Rocket, color: "from-rose-500/20 to-red-500/20", border: "border-rose-400/40", text: "text-rose-400" },
  { href: "/admin/publications", label: "Publications & Mag", icon: FileText, color: "from-violet-500/20 to-purple-500/20", border: "border-violet-400/40", text: "text-violet-300" },
  { href: "/admin/contact-info", label: "Contact Info & Socials", icon: Phone, color: "from-amber-500/20 to-yellow-500/20", border: "border-amber-400/40", text: "text-amber-300" },
  { href: "/admin/executives", label: "Executive Committee", icon: Shield, color: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/30", text: "text-rose-400", stat: "executives" },
  { href: "/admin/moderators", label: "Club Moderators", icon: Award, color: "from-indigo-500/20 to-purple-500/20", border: "border-indigo-500/30", text: "text-indigo-400", stat: "moderators" },
  { href: "/admin/ex-panel", label: "Alumni & Former Panels", icon: GraduationCap, color: "from-amber-500/20 to-yellow-500/20", border: "border-amber-500/30", text: "text-amber-400", stat: "alumni" },
  { href: "/admin/events", label: "Events & Festivals", icon: Calendar, color: "from-purple-500/20 to-violet-500/20", border: "border-purple-500/30", text: "text-purple-400", stat: "events" },
  { href: "/admin/messages", label: "Contact Messages", icon: MessageSquare, color: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/30", text: "text-blue-400", stat: "contactMessages" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    contactMessages: 0,
    joinRequests: 0,
    events: 0,
    ambassadors: 0,
    executives: 0,
    alumni: 46,
    moderators: 5,
  });
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "offline">("checking");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await adminGetDashboardStats();
      let alumni = 46;
      let moderators = 5;
      if (typeof window !== "undefined") {
        try {
          const ex = localStorage.getItem("gscsc_ex_panel");
          if (ex) alumni = JSON.parse(ex).length;
          const mods = localStorage.getItem("gscsc_club_moderators");
          if (mods) moderators = JSON.parse(mods).length;
        } catch {}
      }
      setStats({
        ...data,
        alumni,
        moderators,
      });
      setDbStatus("connected");
    } catch {
      setDbStatus("offline");
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-white/50 text-xs mt-1">
            GSCSC Management Portal &bull; Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* DB Status Badge */}
          <span
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${
              dbStatus === "connected"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : dbStatus === "offline"
                ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                : "bg-white/5 border-white/10 text-white/50"
            }`}
          >
            {dbStatus === "connected" ? (
              <CheckCircle2 size={12} />
            ) : (
              <AlertCircle size={12} />
            )}
            DB: {dbStatus === "checking" ? "Checking..." : dbStatus === "connected" ? "Supabase Connected" : "DB Offline (Demo Mode)"}
          </span>

          <button
            onClick={loadStats}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-400/10 border border-sky-400/30 text-sky-400 text-xs font-semibold hover:bg-sky-400/20 transition-all"
          >
            <Globe size={14} />
            View Site
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {QUICK_LINKS.map((item) => {
          const Icon = item.icon;
          const count = stats[item.stat as keyof Stats];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-2xl p-4 border ${item.border} bg-gradient-to-br ${item.color} flex flex-col gap-3 hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between">
                <Icon size={18} className={item.text} />
                <ArrowRight size={14} className="text-white/30" />
              </div>
              <div>
                <span className={`text-2xl font-black ${item.text}`}>
                  {loading ? "—" : count !== undefined ? count : "4 Gateways"}
                </span>
                <p className="text-white/60 text-[0.7rem] font-semibold mt-0.5">
                  {item.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Contact Messages Panel */}
        <div
          className="rounded-2xl p-5 border border-white/10 col-span-1 md:col-span-2 lg:col-span-1"
          style={{ background: "rgba(18, 14, 28, 0.9)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-400" />
              Incoming Messages
            </h2>
            <Link href="/admin/messages" className="text-xs text-blue-400 hover:underline">
              View all &rarr;
            </Link>
          </div>
          <p className="text-white/50 text-xs leading-relaxed">
            {loading ? "Loading..." : `${stats.contactMessages} total contact messages received. Click below to manage, read, and delete messages from visitors.`}
          </p>
          <Link
            href="/admin/messages"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-500/25 transition-colors"
          >
            <MessageSquare size={14} />
            Manage Messages
          </Link>
        </div>

        {/* Join Requests Panel */}
        <div
          className="rounded-2xl p-5 border border-white/10"
          style={{ background: "rgba(18, 14, 28, 0.9)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus size={16} className="text-emerald-400" />
              Membership Requests
            </h2>
            <Link href="/admin/join-requests" className="text-xs text-emerald-400 hover:underline">
              Manage &rarr;
            </Link>
          </div>
          <p className="text-white/50 text-xs leading-relaxed">
            {loading ? "Loading..." : `${stats.joinRequests} pending applications. Review and approve or reject new member registrations.`}
          </p>
          <Link
            href="/admin/join-requests"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/25 transition-colors"
          >
            <UserPlus size={14} />
            Review Applications
          </Link>
        </div>

        {/* Site Overview */}
        <div
          className="rounded-2xl p-5 border border-white/10"
          style={{ background: "rgba(18, 14, 28, 0.9)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-sky-400" />
            <h2 className="text-sm font-bold text-white">Site Overview</h2>
          </div>
          <div className="space-y-2 text-xs text-white/60">
            <div className="flex justify-between">
              <span>Total Pages</span>
              <span className="text-white font-bold">17</span>
            </div>
            <div className="flex justify-between">
              <span>DB Tables</span>
              <span className="text-white font-bold">9</span>
            </div>
            <div className="flex justify-between">
              <span>Frame Assets</span>
              <span className="text-white font-bold">120 PNGs</span>
            </div>
            <div className="flex justify-between">
              <span>Framework</span>
              <span className="text-white font-bold">Next.js 14</span>
            </div>
            <div className="flex justify-between">
              <span>Backend</span>
              <span className="text-white font-bold">Supabase</span>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400/10 border border-sky-400/30 text-sky-400 text-xs font-semibold hover:bg-sky-400/20 transition-colors"
          >
            <Globe size={14} />
            Visit Live Site
          </Link>
        </div>
      </div>

      {/* All Admin Sections Grid */}
      <div>
        <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">
          All Admin Sections
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { href: "/admin/ambassadors", label: "Campus Ambassadors", icon: Trophy },
            { href: "/admin/executives", label: "Executive Panel", icon: Shield },
            { href: "/admin/sub-executives", label: "Sub-Executive", icon: Users },
            { href: "/admin/ex-panel", label: "Ex-Panelists", icon: Users },
            { href: "/admin/alumni", label: "Alumni Members", icon: GraduationCap },
            { href: "/admin/departments", label: "Departments / Wings", icon: Layers },
            { href: "/admin/workshops", label: "Workshops", icon: FlaskConical },
            { href: "/admin/projects", label: "Research & Projects", icon: Microscope },
            { href: "/admin/publications", label: "Publications", icon: FileText },
            { href: "/admin/contact-info", label: "Contact Info", icon: Phone },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl p-3.5 border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/15 transition-all group flex flex-col gap-2"
            >
              <Icon size={18} className="text-white/40 group-hover:text-sky-400 transition-colors" />
              <span className="text-xs font-semibold text-white/60 group-hover:text-white transition-colors leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


