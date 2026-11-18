"use client";

import { ALUMNI_MEMBERS } from "./alumni-data";
import { DEFAULT_EXECUTIVES } from "./executives-data";
import { DEFAULT_MODERATORS } from "./moderators-data";

export interface DatabaseDump {
  version: string;
  exportedAt: string;
  club: string;
  data: {
    alumni_members: any[];
    executive_members: any[];
    club_moderators: any[];
    events: any[];
    club_partners: any[];
    join_requests: any[];
    contact_messages: any[];
  };
}

function getStoredOr<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const s = localStorage.getItem(key);
    if (s) {
      const p = JSON.parse(s);
      if (Array.isArray(p) && p.length > 0) return p as T;
    }
  } catch {
    // fallback
  }
  return fallback;
}

export function getFullDatabaseState(): DatabaseDump {
  const alumni = getStoredOr("gscsc_ex_panel", ALUMNI_MEMBERS);
  const executives = getStoredOr("gscsc_executives", DEFAULT_EXECUTIVES);
  const moderators = getStoredOr("gscsc_club_moderators", DEFAULT_MODERATORS);
  const events = getStoredOr("gscsc_events", [
    { id: 1, title: "12th National Science & Tech Carnival 2025", date: "Nov 2025", category: "Carnival" },
    { id: 2, title: "GSC Falcon Sounding Rocket Workshop", date: "Apr 2025", category: "Workshop" }
  ]);
  const partners = getStoredOr("gscsc_club_partners", [
    { id: 1, name: "Bangladesh Science Society (BSS)", type: "Academic Partner" },
    { id: 2, name: "BUET Science Club", type: "Club Partner" }
  ]);
  const joinRequests = getStoredOr("gscsc_join_requests", []);
  const contactMessages = getStoredOr("gscsc_contact_messages", []);

  return {
    version: "2.0.0",
    exportedAt: new Date().toISOString(),
    club: "Govt. Science College Science Club (GSCSC)",
    data: {
      alumni_members: alumni,
      executive_members: executives,
      club_moderators: moderators,
      events,
      club_partners: partners,
      join_requests: joinRequests,
      contact_messages: contactMessages,
    },
  };
}

export function exportFullDatabaseJSON(): string {
  const state = getFullDatabaseState();
  return JSON.stringify(state, null, 2);
}

function escapeSql(val: any): string {
  if (val === null || val === undefined) return "NULL";
  const s = String(val).replace(/'/g, "''");
  return `'${s}'`;
}

export function exportFullDatabaseSQL(): string {
  const state = getFullDatabaseState();
  const sql: string[] = [];

  sql.push("-- ============================================================================");
  sql.push("-- GOVT. SCIENCE COLLEGE SCIENCE CLUB (GSCSC) - FULL DATABASE BACKUP DUMP");
  sql.push(`-- Exported At: ${state.exportedAt}`);
  sql.push("-- Format: Standard SQL (PostgreSQL, MySQL, SQLite, Supabase, Cloudflare D1)");
  sql.push("-- ============================================================================\n");

  // 1. Alumni
  sql.push("-- 1. ALUMNI & FORMER PANELS");
  sql.push(`CREATE TABLE IF NOT EXISTS alumni_members (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    batch VARCHAR(100),
    photo TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    blood VARCHAR(10),
    undergrad TEXT,
    postgrad TEXT,
    other_degrees TEXT,
    current_position TEXT,
    social_url TEXT,
    display_order INT DEFAULT 99
);`);
  for (const a of state.data.alumni_members) {
    sql.push(`INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (${a.id}, ${escapeSql(a.name)}, ${escapeSql(a.role)}, ${escapeSql(a.batch)}, ${escapeSql(a.photo)}, ${escapeSql(a.email)}, ${escapeSql(a.phone)}, ${escapeSql(a.blood)}, ${escapeSql(a.undergrad)}, ${escapeSql(a.postgrad)}, ${escapeSql(a.other_degrees)}, ${escapeSql(a.current_position)}, ${escapeSql(a.social_url)}, ${a.display_order || 99});`);
  }

  // 2. Executives
  sql.push("\n-- 2. EXECUTIVE COMMITTEE");
  sql.push(`CREATE TABLE IF NOT EXISTS executive_members (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    session VARCHAR(100),
    photo TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    blood VARCHAR(10),
    bio TEXT,
    display_order INT DEFAULT 99
);`);
  for (const e of state.data.executive_members) {
    sql.push(`INSERT INTO executive_members (id, name, role, department, session, photo, phone, email, blood, bio, display_order) VALUES (${e.id}, ${escapeSql(e.name)}, ${escapeSql(e.role)}, ${escapeSql(e.department || e.wing)}, ${escapeSql(e.session || e.batch)}, ${escapeSql(e.photo || e.profile_image)}, ${escapeSql(e.phone)}, ${escapeSql(e.email)}, ${escapeSql(e.blood)}, ${escapeSql(e.bio)}, ${e.display_order || 99});`);
  }

  // 3. Moderators
  sql.push("\n-- 3. CLUB MODERATORS");
  sql.push(`CREATE TABLE IF NOT EXISTS club_moderators (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    tag VARCHAR(255),
    bio TEXT,
    photo TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    display_order INT DEFAULT 99
);`);
  for (const m of state.data.club_moderators) {
    sql.push(`INSERT INTO club_moderators (id, name, designation, department, tag, bio, photo, phone, email, display_order) VALUES (${m.id}, ${escapeSql(m.name)}, ${escapeSql(m.designation)}, ${escapeSql(m.department)}, ${escapeSql(m.tag)}, ${escapeSql(m.bio)}, ${escapeSql(m.photo)}, ${escapeSql(m.phone)}, ${escapeSql(m.email)}, ${m.display_order || 99});`);
  }

  // 4. Join Requests
  sql.push("\n-- 4. JOIN REQUESTS");
  sql.push(`CREATE TABLE IF NOT EXISTS join_requests (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    college_roll VARCHAR(50),
    session VARCHAR(50),
    department VARCHAR(255),
    interest TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);
  for (const r of state.data.join_requests) {
    sql.push(`INSERT INTO join_requests (id, name, email, phone, college_roll, session, department, interest, status) VALUES (${r.id}, ${escapeSql(r.name)}, ${escapeSql(r.email)}, ${escapeSql(r.phone)}, ${escapeSql(r.college_roll)}, ${escapeSql(r.session)}, ${escapeSql(r.department)}, ${escapeSql(r.interest)}, ${escapeSql(r.status)});`);
  }

  // 5. Contact Messages
  sql.push("\n-- 5. CONTACT MESSAGES");
  sql.push(`CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);
  for (const msg of state.data.contact_messages) {
    sql.push(`INSERT INTO contact_messages (id, name, email, subject, message, is_read) VALUES (${msg.id}, ${escapeSql(msg.name)}, ${escapeSql(msg.email)}, ${escapeSql(msg.subject)}, ${escapeSql(msg.message)}, ${msg.is_read ? "TRUE" : "FALSE"});`);
  }

  // 6. Admin Users
  sql.push("\n-- 6. ADMIN & STAFF USERS");
  sql.push(`CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);
INSERT INTO admin_users (username, password_hash, name, role) VALUES ('jim', 'jim1234', 'Jim', 'administrator');
INSERT INTO admin_users (username, password_hash, name, role) VALUES ('gscscstuff', '@gscscstuff1981', 'GSCSC Staff', 'staff');
`);

  return sql.join("\n");
}

export function restoreDatabaseFromJSON(jsonString: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const parsed: DatabaseDump = JSON.parse(jsonString);
    if (!parsed.data) return false;

    if (parsed.data.alumni_members) {
      localStorage.setItem("gscsc_ex_panel", JSON.stringify(parsed.data.alumni_members));
      window.dispatchEvent(new Event("gscsc_ex_panel_updated"));
    }
    if (parsed.data.executive_members) {
      localStorage.setItem("gscsc_executives", JSON.stringify(parsed.data.executive_members));
      window.dispatchEvent(new Event("gscsc_executives_updated"));
    }
    if (parsed.data.club_moderators) {
      localStorage.setItem("gscsc_club_moderators", JSON.stringify(parsed.data.club_moderators));
      window.dispatchEvent(new Event("gscsc_moderators_updated"));
    }
    if (parsed.data.events) {
      localStorage.setItem("gscsc_events", JSON.stringify(parsed.data.events));
    }
    if (parsed.data.club_partners) {
      localStorage.setItem("gscsc_club_partners", JSON.stringify(parsed.data.club_partners));
    }
    if (parsed.data.join_requests) {
      localStorage.setItem("gscsc_join_requests", JSON.stringify(parsed.data.join_requests));
      window.dispatchEvent(new Event("gscsc_join_requests_updated"));
    }
    if (parsed.data.contact_messages) {
      localStorage.setItem("gscsc_contact_messages", JSON.stringify(parsed.data.contact_messages));
      window.dispatchEvent(new Event("gscsc_contact_messages_updated"));
    }

    return true;
  } catch (err) {
    console.error("Failed to restore database:", err);
    return false;
  }
}

export function downloadBrowserFile(content: string, filename: string, mimeType: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
