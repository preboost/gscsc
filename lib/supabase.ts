import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://eaujlyklcwnebzyqpqqe.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhdWpseWtsY3duZWJ6eXFwcXFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODU3ODcsImV4cCI6MjA2OTU2MTc4N30.cjBOHdrGPMgx5o8Pc8oBJwxSt1a3iWCh44AkAf-jGIo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface JoinRequestPayload {
  name: string;
  email: string;
  phone?: string;
  college_roll?: string;
  session?: string;
  departments?: string[];
  role_applied?: string;
  blood?: string;
  photo?: string;
  institution?: string;
  interest?: string;
  trx_id?: string;
  payment_method?: string;
}

// Submit contact message with local persistence
export async function submitContactMessage(payload: ContactMessagePayload) {
  const newMsg = {
    id: Date.now(),
    name: payload.name,
    email: payload.email,
    subject: payload.subject || "General Inquiry",
    message: payload.message,
    created_at: new Date().toISOString(),
    is_read: false,
  };

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_contact_messages");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newMsg);
      localStorage.setItem("gscsc_contact_messages", JSON.stringify(list));
      window.dispatchEvent(new Event("gscsc_contact_messages_updated"));
    } catch (e) {
      console.warn("Local storage error:", e);
    }
  }

  // Background attempt to Supabase
  try {
    await supabase.from("contact_messages").insert([payload]);
  } catch {
    // offline
  }

  return { success: true };
}

// Submit membership request with local persistence
export async function submitJoinRequest(payload: JoinRequestPayload) {
  const newReq = {
    id: Date.now(),
    name: payload.name,
    email: payload.email,
    phone: payload.phone || "",
    college_roll: payload.college_roll || "",
    session: payload.session || "",
    role_applied: payload.role_applied || "Executive Committee",
    department: payload.departments?.join(", ") || "",
    blood: payload.blood || "",
    photo: payload.photo || "",
    institution: payload.institution || "Govt. Science College",
    interest: payload.interest || "",
    status: "pending",
    created_at: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_join_requests");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newReq);
      localStorage.setItem("gscsc_join_requests", JSON.stringify(list));
      window.dispatchEvent(new Event("gscsc_join_requests_updated"));
    } catch (e) {
      console.warn("Local storage error:", e);
    }
  }

  // Background attempt to Supabase
  try {
    await supabase.from("join_requests").insert([payload]);
  } catch {
    // offline
  }

  return { success: true };
}

// Fetch alumni members
export async function getAlumniMembers() {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_ex_panel");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
  }
  return [];
}
