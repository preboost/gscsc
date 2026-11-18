"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, Eye, EyeOff, Copy, Check, Search, Calendar, User } from "lucide-react";

type Msg = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read?: boolean;
};

const SAMPLE_MSGS: Msg[] = [
  {
    id: 1731800200000,
    name: "Dr. Farhana Yasmin",
    email: "farhana.edu@gmail.com",
    subject: "Invitation for National Science Olympiad 2025",
    message: "Greetings GSCSC, We would like to collaborate on the upcoming inter-college national astrophysics workshop and olympiad.",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    is_read: false,
  },
];

export default function AdminMessages() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [selected, setSelected] = useState<Msg | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
    const handleUpdate = () => load();
    window.addEventListener("gscsc_contact_messages_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("gscsc_contact_messages_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  function load() {
    try {
      const stored = localStorage.getItem("gscsc_contact_messages");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMsgs(parsed);
          return;
        }
      }
    } catch {
      // fallback
    }
    setMsgs(SAMPLE_MSGS);
  }

  function persist(newMsgs: Msg[]) {
    setMsgs(newMsgs);
    try {
      localStorage.setItem("gscsc_contact_messages", JSON.stringify(newMsgs));
      window.dispatchEvent(new Event("gscsc_contact_messages_updated"));
    } catch (e) {
      console.error(e);
    }
  }

  function del(id: number) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const updated = msgs.filter((x) => x.id !== id);
    persist(updated);
    if (selected?.id === id) setSelected(null);
  }

  function toggleRead(msg: Msg) {
    const updated = msgs.map((x) => (x.id === msg.id ? { ...x, is_read: !x.is_read } : x));
    persist(updated);
    if (selected?.id === msg.id) setSelected((s) => (s ? { ...s, is_read: !s.is_read } : s));
  }

  function copyEmail(email: string, id: number) {
    navigator.clipboard.writeText(email);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  const filtered = msgs.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Mail size={24} className="text-cyan-400" />
            Contact Inquiries &amp; Messages
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {msgs.length} messages received ({msgs.filter((m) => !m.is_read).length} unread)
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-6 relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by sender, email, subject, keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 text-white text-xs outline-none focus:border-cyan-400 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-xs">
                No messages found.
              </div>
            ) : (
              filtered.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelected(m)}
                  className={`p-4 cursor-pointer transition-all ${
                    selected?.id === m.id
                      ? "bg-cyan-500/15 border-l-4 border-cyan-400"
                      : m.is_read
                      ? "hover:bg-slate-800/40 opacity-70"
                      : "hover:bg-cyan-500/5 bg-slate-950/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${m.is_read ? "bg-slate-600" : "bg-cyan-400 animate-pulse"}`} />
                      <h4 className="font-bold text-white text-sm">{m.name}</h4>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(m.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-cyan-300 text-xs font-semibold mb-1 line-clamp-1">{m.subject}</p>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">{m.message}</p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/40 text-[11px]">
                    <span className="text-slate-500 truncate max-w-[200px]">{m.email}</span>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleRead(m)}
                        className="text-slate-400 hover:text-cyan-300 p-1"
                        title={m.is_read ? "Mark unread" : "Mark read"}
                      >
                        {m.is_read ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                      <button
                        onClick={() => copyEmail(m.email, m.id)}
                        className="text-slate-400 hover:text-cyan-300 p-1"
                        title="Copy Email"
                      >
                        {copied === m.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      </button>
                      <button
                        onClick={() => del(m.id)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                        title="Delete message"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Message Reader (1 col) */}
        <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 shadow-2xl h-fit">
          {selected ? (
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  Message Details
                </span>
                <button
                  onClick={() => toggleRead(selected)}
                  className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {selected.is_read ? <EyeOff size={12} /> : <Eye size={12} />}
                  <span>{selected.is_read ? "Mark Unread" : "Mark Read"}</span>
                </button>
              </div>

              <h3 className="text-base font-bold text-white mb-2 leading-snug">
                {selected.subject}
              </h3>

              <div className="space-y-1 mb-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <User size={13} className="text-cyan-400" />
                  <span className="font-bold">{selected.name}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>{selected.email}</span>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="text-cyan-300 hover:underline font-semibold"
                  >
                    Reply
                  </a>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
                  <Calendar size={11} />
                  <span>{new Date(selected.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors shadow-md"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => del(selected.id)}
                  className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete message"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs">
              Select a message from the list to view its full contents and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
