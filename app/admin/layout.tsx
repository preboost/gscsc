"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  isAdminAuthenticated,
  clearAdminSession,
  getAdminUser,
  AdminUser,
} from "@/lib/adminAuth";
import {
  LayoutDashboard,
  MessageSquare,
  UserPlus,
  Calendar,
  Trophy,
  Users,
  Shield,
  GraduationCap,
  Rocket,
  BookOpen,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Award,
  UserCheck,
  Database,
  CreditCard,
  Layers,
  FlaskConical,
  Microscope,
  FileText,
  Phone,
  Images
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/database", label: "Database & Backup", icon: Database },
  { href: "/admin/payments", label: "Payment Gateways", icon: CreditCard },
  { href: "/admin/about", label: "About & Founder", icon: BookOpen },
  { href: "/admin/events", label: "Events & Festivals", icon: Calendar },
  { href: "/admin/slide-pics", label: "Slide Pics (Gallery)", icon: Images },
  { href: "/admin/falcon", label: "GSC Falcon Wing", icon: Rocket },
  { href: "/admin/achievements", label: "Achievements & Awards", icon: Trophy },
  { href: "/admin/departments", label: "Departments / Wings", icon: Layers },
  { href: "/admin/workshops", label: "Workshops", icon: FlaskConical },
  { href: "/admin/projects", label: "Research & Projects", icon: Microscope },
  { href: "/admin/publications", label: "Publications", icon: FileText },
  { href: "/admin/contact-info", label: "Contact Info", icon: Phone },
  { href: "/admin/executives", label: "Executive Committee", icon: Shield },
  { href: "/admin/moderators", label: "Club Moderators", icon: Award },
  { href: "/admin/ex-panel", label: "Alumni & Former Panels", icon: GraduationCap },
  { href: "/admin/ambassadors", label: "Ambassadors", icon: Trophy },
  { href: "/admin/messages", label: "Contact Messages", icon: MessageSquare },
  { href: "/admin/join-requests", label: "Join Requests", icon: UserPlus },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    if (pathname === "/admin") {
      setAuthChecked(true);
      return;
    }
    if (!isAdminAuthenticated()) {
      router.replace("/admin");
    } else {
      setCurrentUser(getAdminUser());
      setAuthChecked(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    clearAdminSession();
    router.push("/admin");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <span className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (pathname === "/admin") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex relative z-10" style={{ background: "#030712" }}>
      {/* Sidebar Desktop */}
      <aside
        className="hidden md:flex flex-col w-64 flex-shrink-0 border-r border-cyan-500/15"
        style={{
          background: "rgba(6, 12, 28, 0.98)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-cyan-500/15">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400/40 flex-shrink-0 bg-cyan-950/40">
            <Image src="/logo.png" alt="GSCSC Logo" width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <span className="text-white font-bold text-sm block truncate">
              {currentUser?.name || "GSCSC Admin"}
            </span>
            <span className="text-cyan-400/80 text-[0.68rem] uppercase font-mono font-bold tracking-wider">
              {currentUser?.role === "administrator" ? "★ Administrator" : "Staff Member"}
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/40"
                }`}
              >
                <Icon size={15} className={active ? "text-cyan-400" : "text-slate-500"} />
                <span>{item.label}</span>
                {active && <ChevronRight size={13} className="ml-auto text-cyan-400/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-cyan-500/15 px-3 py-3 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all"
          >
            <LayoutDashboard size={15} className="text-slate-500" />
            <span>View Live Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 bg-[#050b1c] border-r border-cyan-500/20 flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-cyan-500/15">
              <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="GSCSC Logo" width={28} height={28} className="rounded-full" />
                <span className="text-white font-bold text-xs">{currentUser?.name || "GSCSC Admin"}</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                      active ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Icon size={15} className={active ? "text-cyan-400" : "text-slate-500"} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-cyan-500/15">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Navbar */}
        <header className="flex md:hidden items-center justify-between p-4 border-b border-cyan-500/15 bg-[#050b1c]">
          <div className="flex items-center gap-2.5">
            <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white">
              <Menu size={20} />
            </button>
            <span className="text-white font-bold text-sm">GSCSC Admin</span>
          </div>
          <span className="text-cyan-400 font-mono text-[11px] font-bold">
            {currentUser?.name || "Admin"}
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#030712]/95 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
