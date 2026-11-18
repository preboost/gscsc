"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  GraduationCap,
  Award,
  Calendar,
  Handshake,
  UserPlus,
  Mail,
  HardDrive
} from "lucide-react";
import {
  exportFullDatabaseJSON,
  exportFullDatabaseSQL,
  restoreDatabaseFromJSON,
  downloadBrowserFile,
  getFullDatabaseState
} from "@/lib/database";

export default function AdminDatabasePage() {
  const [stats, setStats] = useState({
    alumniCount: 0,
    executivesCount: 0,
    moderatorsCount: 0,
    eventsCount: 0,
    partnersCount: 0,
    requestsCount: 0,
    messagesCount: 0,
    totalRecords: 0,
  });
  const [exporting, setExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refreshStats();
  }, []);

  function refreshStats() {
    const s = getFullDatabaseState();
    const d = s.data;
    const total =
      d.alumni_members.length +
      d.executive_members.length +
      d.club_moderators.length +
      d.events.length +
      d.club_partners.length +
      d.join_requests.length +
      d.contact_messages.length;

    setStats({
      alumniCount: d.alumni_members.length,
      executivesCount: d.executive_members.length,
      moderatorsCount: d.club_moderators.length,
      eventsCount: d.events.length,
      partnersCount: d.club_partners.length,
      requestsCount: d.join_requests.length,
      messagesCount: d.contact_messages.length,
      totalRecords: total,
    });
  }

  function handleDownloadSQL() {
    setExporting(true);
    const sqlContent = exportFullDatabaseSQL();
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadBrowserFile(sqlContent, `gscsc_database_dump_${dateStr}.sql`, "text/sql");
    setExporting(false);
    setSuccessMsg("SQL Database Dump downloaded successfully!");
    setTimeout(() => setSuccessMsg(null), 4000);
  }

  function handleDownloadJSON() {
    setExporting(true);
    const jsonContent = exportFullDatabaseJSON();
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadBrowserFile(jsonContent, `gscsc_full_backup_${dateStr}.json`, "application/json");
    setExporting(false);
    setSuccessMsg("Full JSON Backup downloaded successfully!");
    setTimeout(() => setSuccessMsg(null), 4000);
  }

  function handleRestoreFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const ok = restoreDatabaseFromJSON(text);
      if (ok) {
        refreshStats();
        setSuccessMsg("Database restored successfully from backup file!");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        alert("Invalid backup file format. Please upload a valid GSCSC JSON backup.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Database size={24} className="text-cyan-400" />
            Database &amp; Backup Center
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Centralized database repository for all club members, executives, moderators, banners, events, and requests. Real-time auto sync enabled.
          </p>
        </div>

        {/* Live sync badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Database Live &bull; Auto-Sync Active</span>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-xl">
          <div className="text-slate-400 text-xs font-mono mb-1">Total Records</div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">
            {stats.totalRecords}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Across 7 core tables</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-sky-500/20 backdrop-blur-xl">
          <div className="text-slate-400 text-xs font-mono mb-1">Alumni Leaders</div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.alumniCount}
          </div>
          <div className="text-[10px] text-sky-400 mt-1">From Google Sheet</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/20 backdrop-blur-xl">
          <div className="text-slate-400 text-xs font-mono mb-1">Executives &amp; Faculty</div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.executivesCount + stats.moderatorsCount}
          </div>
          <div className="text-[10px] text-indigo-400 mt-1">{stats.executivesCount} Execs + {stats.moderatorsCount} Mods</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-xl">
          <div className="text-slate-400 text-xs font-mono mb-1">SQL Format</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            SQL v2.0
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Postgres / MySQL / D1</div>
        </div>
      </div>

      {/* ════ ONE-CLICK BACKUP & EXPORT ACTIONS ════ */}
      <div className="mb-8 p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-sky-950/40 backdrop-blur-2xl shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Download size={20} className="text-cyan-400" />
          One-Click Database Export &amp; Backup
        </h2>
        <p className="text-slate-400 text-xs mb-6 max-w-2xl leading-relaxed">
          Download the complete database in your preferred format. All photos, personal data, member details, events, and applications are packaged together.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Download SQL */}
          <button
            onClick={handleDownloadSQL}
            disabled={exporting}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
          >
            <Database size={16} />
            <span>Download Full SQL Dump (.sql)</span>
          </button>

          {/* Download JSON */}
          <button
            onClick={handleDownloadJSON}
            disabled={exporting}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-cyan-400/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95"
          >
            <FileText size={16} />
            <span>Download JSON Backup (.json)</span>
          </button>

          {/* Restore / Import */}
          <div className="w-full sm:w-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleRestoreFile}
              className="hidden"
              id="restore-database-file"
            />
            <label
              htmlFor="restore-database-file"
              className="cursor-pointer w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md"
            >
              <Upload size={16} className="text-slate-400" />
              <span>Restore Database from File</span>
            </label>
          </div>
        </div>
      </div>

      {/* ════ DATABASE TABLES DIRECTORY ════ */}
      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 font-mono uppercase tracking-wider">
        <HardDrive size={16} className="text-cyan-400" />
        Managed Database Tables &amp; Entities
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Alumni */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <GraduationCap size={18} />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">alumni_members</h4>
              <p className="text-[10px] text-slate-400">Google Sheet members with photos</p>
            </div>
          </div>
          <span className="font-mono text-cyan-400 font-bold text-sm bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800">
            {stats.alumniCount}
          </span>
        </div>

        {/* Executives */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Shield size={18} />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">executive_members</h4>
              <p className="text-[10px] text-slate-400">Central executive committee</p>
            </div>
          </div>
          <span className="font-mono text-sky-400 font-bold text-sm bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-800">
            {stats.executivesCount}
          </span>
        </div>

        {/* Moderators */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Award size={18} />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">club_moderators</h4>
              <p className="text-[10px] text-slate-400">Faculty advisory board</p>
            </div>
          </div>
          <span className="font-mono text-indigo-400 font-bold text-sm bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-800">
            {stats.moderatorsCount}
          </span>
        </div>

        {/* Events */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Calendar size={18} />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">events_festivals</h4>
              <p className="text-[10px] text-slate-400">National science carnivals &amp; tests</p>
            </div>
          </div>
          <span className="font-mono text-amber-400 font-bold text-sm bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800">
            {stats.eventsCount}
          </span>
        </div>

        {/* Join Requests */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <UserPlus size={18} />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">join_requests</h4>
              <p className="text-[10px] text-slate-400">Live membership applications</p>
            </div>
          </div>
          <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
            {stats.requestsCount}
          </span>
        </div>

        {/* Contact Messages */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-400/30 flex items-center justify-center text-rose-400">
              <Mail size={18} />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">contact_messages</h4>
              <p className="text-[10px] text-slate-400">Public inquiries &amp; messages</p>
            </div>
          </div>
          <span className="font-mono text-rose-400 font-bold text-sm bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-800">
            {stats.messagesCount}
          </span>
        </div>
      </div>
    </div>
  );
}
