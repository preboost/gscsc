// Admin authentication config with multiple secure accounts & role support

export interface AdminUser {
  username: string;
  name: string;
  role: "administrator" | "staff";
}

const AUTHORIZED_ACCOUNTS: Record<string, { pass: string; name: string; role: "administrator" | "staff" }> = {
  jim: {
    pass: "jim1234",
    name: "Jim",
    role: "administrator",
  },
  gscscstuff: {
    pass: "@gscscstuff1981",
    name: "GSCSC Staff",
    role: "staff",
  },
};

export const ADMIN_SESSION_KEY = "gscsc_admin_session";
export const ADMIN_SESSION_EXPIRY_HOURS = 12;

export function authenticateAdmin(username: string, pass: string): AdminUser | null {
  const user = AUTHORIZED_ACCOUNTS[username.trim().toLowerCase()];
  if (user && user.pass === pass.trim()) {
    return {
      username: username.trim().toLowerCase(),
      name: user.name,
      role: user.role,
    };
  }
  return null;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) return false;
    const parsed = JSON.parse(session);
    const now = Date.now();
    if (now > parsed.expiresAt) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
    return parsed.authenticated === true;
  } catch {
    return false;
  }
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) return null;
    const parsed = JSON.parse(session);
    return parsed.user || null;
  } catch {
    return null;
  }
}

export function setAdminSession(user: AdminUser): void {
  if (typeof window === "undefined") return;
  const expiresAt = Date.now() + ADMIN_SESSION_EXPIRY_HOURS * 60 * 60 * 1000;
  localStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({ authenticated: true, user, expiresAt })
  );
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
