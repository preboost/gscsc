"use client";

// Site Mode & Lockdown Controller
// Controls the emergency lockdown / developer showcase mode (Administrator only).
// When enabled:
// - Homepage (/) shows the /developer page.
// - All other public pages show 404 (Not Found).
// - Admin panel (/admin, /admin/*) remains fully accessible so administrator can toggle it off.
// - When disabled: everything is normal & visible.

export const LOCKDOWN_STORAGE_KEY = "gscsc_site_lockdown_mode";
export const LOCKDOWN_SYNC_KEY = "site_lockdown_mode";
export const LOCKDOWN_EVENT = "gscsc_lockdown_mode_changed";

export function getSiteLockdownState(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const val = localStorage.getItem(LOCKDOWN_STORAGE_KEY);
    return val === "true";
  } catch {
    return false;
  }
}

export function setSiteLockdownState(enabled: boolean, updatedBy: string = "Jim (Administrator)"): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(LOCKDOWN_STORAGE_KEY, enabled ? "true" : "false");
    window.dispatchEvent(new CustomEvent(LOCKDOWN_EVENT, { detail: { enabled } }));
  } catch (err) {
    console.error("Storage error setting lockdown:", err);
  }

  // Also sync to Cloudflare KV Edge API
  try {
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: LOCKDOWN_SYNC_KEY,
        data: {
          enabled,
          updatedAt: new Date().toISOString(),
          updatedBy,
        },
      }),
    }).catch((err) => console.warn("KV sync notice:", err));
  } catch {}
}

export async function fetchCloudSiteLockdownState(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const res = await fetch(`/api/sync?key=${LOCKDOWN_SYNC_KEY}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
    if (res.ok) {
      const json = await res.json();
      const enabled =
        json === true ||
        json?.enabled === true ||
        json?.data === true ||
        json?.data?.enabled === true;

      try {
        localStorage.setItem(LOCKDOWN_STORAGE_KEY, enabled ? "true" : "false");
        window.dispatchEvent(new CustomEvent(LOCKDOWN_EVENT, { detail: { enabled } }));
      } catch {}
      return enabled;
    }
  } catch {}
  return getSiteLockdownState();
}
