export interface ContactSettings {
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  address: string;
  room: string;
  hours: string;
  tagline?: string;
  facebookPage: string;
  facebookGroup: string;
  discord: string;
  linkedin: string;
  instagram?: string;
  youtube?: string;
}

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  phone1: "+880 1914-176174",
  phone2: "+880 19151-32965",
  email1: "gscsc.official@gmail.com",
  email2: "gscsc.official@gmail.com",
  address: "Govt. Science College, Tejgaon, Dhaka-1215, Bangladesh",
  room: "Room 204, Science Complex (Ground Floor)",
  hours: "Saturday – Thursday: 10:00 AM – 5:00 PM",
  tagline: "Where curiosity meets innovation since 1981.",
  facebookPage: "https://facebook.com/gscsc.official",
  facebookGroup: "https://facebook.com/groups/gscsc",
  discord: "https://discord.gg/gscsc",
  linkedin: "https://linkedin.com/company/gscsc",
  instagram: "https://instagram.com/gscsc.official",
  youtube: "https://youtube.com/@gscsc.official",
};

export function getStoredContactSettings(): ContactSettings {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_contact_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.phone1 || parsed.email1)) {
          return {
            ...DEFAULT_CONTACT_SETTINGS,
            ...parsed,
          };
        }
      }
    } catch {}
  }
  return DEFAULT_CONTACT_SETTINGS;
}

export async function fetchCloudContactSettings(): Promise<ContactSettings> {
  if (typeof window === "undefined") return DEFAULT_CONTACT_SETTINGS;
  try {
    const res = await fetch("/api/sync?key=contact_settings", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
    });
    if (res.ok) {
      const json = await res.json();
      const data = json?.data !== undefined ? json.data : json;
      if (data && (data.phone1 || data.email1)) {
        const merged: ContactSettings = {
          ...DEFAULT_CONTACT_SETTINGS,
          ...data,
        };
        try {
          localStorage.setItem("gscsc_contact_settings", JSON.stringify(merged));
          window.dispatchEvent(new Event("gscsc_contact_settings_updated"));
        } catch {}
        return merged;
      }
    }
  } catch (err) {
    console.warn("Could not fetch cloud contact settings:", err);
  }
  return getStoredContactSettings();
}

export function saveStoredContactSettings(settings: ContactSettings) {
  if (typeof window !== "undefined") {
    // 1. Save to local storage for immediate browser update
    try {
      localStorage.setItem("gscsc_contact_settings", JSON.stringify(settings));
      window.dispatchEvent(new Event("gscsc_contact_settings_updated"));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Local storage error:", err);
    }

    // 2. Sync to Cloudflare KV Edge API
    try {
      fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "contact_settings",
          data: settings,
        }),
      }).catch((err) => console.warn("KV sync warning for contact settings:", err));
    } catch {}
  }
}
