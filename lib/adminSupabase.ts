// Extended Supabase queries for admin panel
import { supabase } from "./supabase";

export interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface JoinRequest {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  college_roll?: string;
  session?: string;
  departments?: string[];
  interest?: string;
  status?: string;
}

export interface Event {
  id: string;
  created_at: string;
  title: string;
  description?: string;
  starts_at: string;
  ends_at?: string;
  venue?: string;
  active: boolean;
}

export interface CampusAmbassador {
  id: string;
  created_at: string;
  name: string;
  institution?: string;
  points: number;
  active: boolean;
}

export interface ExecutiveMember {
  id: string;
  created_at: string;
  name: string;
  role?: string;
  batch?: string;
  department?: string;
  image_url?: string;
  display_order?: number;
}

export interface SubExecutiveMember {
  id: string;
  created_at: string;
  name: string;
  role?: string;
  batch?: string;
  department?: string;
  display_order?: number;
}

export interface ExPanelMember {
  id: string;
  created_at: string;
  name: string;
  role?: string;
  batch?: string;
  current_position?: string;
  institution?: string;
  active: boolean;
}

export interface AlumniMember {
  id: string;
  created_at: string;
  name: string;
  batch?: string;
  current_role?: string;
  institution?: string;
  active: boolean;
  display_order?: number;
}

export interface ClubPartner {
  id: string;
  created_at: string;
  name: string;
  type?: string;
  logo_url?: string;
  website?: string;
  active: boolean;
  display_order?: number;
}

// ─── CONTACT MESSAGES ─────────────────────────────────────────────────────────
export async function adminGetContactMessages(): Promise<ContactMessage[]> {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  } catch { return []; }
}

export async function adminDeleteContactMessage(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    return !error;
  } catch { return false; }
}

// ─── JOIN REQUESTS ─────────────────────────────────────────────────────────────
export async function adminGetJoinRequests(): Promise<JoinRequest[]> {
  try {
    const { data, error } = await supabase
      .from("join_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  } catch { return []; }
}

export async function adminUpdateJoinRequestStatus(id: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("join_requests").update({ status }).eq("id", id);
    return !error;
  } catch { return false; }
}

export async function adminDeleteJoinRequest(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("join_requests").delete().eq("id", id);
    return !error;
  } catch { return false; }
}

// ─── EVENTS ────────────────────────────────────────────────────────────────────
export async function adminGetEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("starts_at", { ascending: false });
    if (error) return [];
    return data || [];
  } catch { return []; }
}

export async function adminToggleEventActive(id: string, active: boolean): Promise<boolean> {
  try {
    const { error } = await supabase.from("events").update({ active }).eq("id", id);
    return !error;
  } catch { return false; }
}

export async function adminDeleteEvent(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("events").delete().eq("id", id);
    return !error;
  } catch { return false; }
}

// ─── CAMPUS AMBASSADORS ────────────────────────────────────────────────────────
export async function adminGetCampusAmbassadors(): Promise<CampusAmbassador[]> {
  try {
    const { data, error } = await supabase
      .from("campus_ambassadors")
      .select("*")
      .order("points", { ascending: false });
    if (error) return [];
    return data || [];
  } catch { return []; }
}

export async function adminUpdateAmbassadorPoints(id: string, points: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("campus_ambassadors").update({ points }).eq("id", id);
    return !error;
  } catch { return false; }
}

export async function adminDeleteAmbassador(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("campus_ambassadors").delete().eq("id", id);
    return !error;
  } catch { return false; }
}

// ─── EXECUTIVE MEMBERS ─────────────────────────────────────────────────────────
export async function adminGetExecutiveMembers(): Promise<ExecutiveMember[]> {
  try {
    const { data, error } = await supabase
      .from("executive_members")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) return [];
    return data || [];
  } catch { return []; }
}

export async function adminDeleteExecutiveMember(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("executive_members").delete().eq("id", id);
    return !error;
  } catch { return false; }
}

// ─── SUB EXECUTIVE MEMBERS ────────────────────────────────────────────────────
export async function adminGetSubExecutiveMembers(): Promise<SubExecutiveMember[]> {
  try {
    const { data, error } = await supabase
      .from("sub_executive_members")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) return [];
    return data || [];
  } catch { return []; }
}

// ─── EX PANEL MEMBERS ─────────────────────────────────────────────────────────
export async function adminGetExPanelMembers(): Promise<ExPanelMember[]> {
  try {
    const { data, error } = await supabase
      .from("ex_panel_members")
      .select("*")
      .order("batch", { ascending: false });
    if (error) return [];
    return data || [];
  } catch { return []; }
}

// ─── ALUMNI MEMBERS ────────────────────────────────────────────────────────────
export async function adminGetAlumniMembers(): Promise<AlumniMember[]> {
  try {
    const { data, error } = await supabase
      .from("alumni_members")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) return [];
    return data || [];
  } catch { return []; }
}

// ─── DASHBOARD STATS ───────────────────────────────────────────────────────────
export async function adminGetDashboardStats() {
  let contactMessages = 1;
  let joinRequests = 1;
  let events = 3;
  let ambassadors = 28;
  let executives = 9;

  if (typeof window !== "undefined") {
    try {
      const msgs = localStorage.getItem("gscsc_contact_messages");
      if (msgs) contactMessages = JSON.parse(msgs).length;
      const reqs = localStorage.getItem("gscsc_join_requests");
      if (reqs) joinRequests = JSON.parse(reqs).length;
      const evs = localStorage.getItem("gscsc_events");
      if (evs) events = JSON.parse(evs).length;
      const execs = localStorage.getItem("gscsc_executives");
      if (execs) executives = JSON.parse(execs).length;
    } catch {
      // fallback
    }
  }

  return {
    contactMessages,
    joinRequests,
    events,
    ambassadors,
    executives,
  };
}
