export interface ContactSettings {
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  address: string;
  room: string;
  hours: string;
  facebookPage: string;
  facebookGroup: string;
  discord: string;
  linkedin: string;
}

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  phone1: "01889934482",
  phone2: "01979464857",
  email1: "contact@gscsc.org",
  email2: "president@gscsc.org",
  address: "Govt. Science College, Tejgaon, Dhaka-1215, Bangladesh",
  room: "Room 204, Science Complex (Ground Floor)",
  hours: "Saturday – Thursday: 10:00 AM – 5:00 PM",
  facebookPage: "https://facebook.com/gscsc.official",
  facebookGroup: "https://facebook.com/groups/gscsc",
  discord: "https://discord.gg/gscsc",
  linkedin: "https://linkedin.com/company/gscsc",
};

export function getStoredContactSettings(): ContactSettings {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_contact_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.phone1) return parsed;
      }
    } catch {}
  }
  return DEFAULT_CONTACT_SETTINGS;
}

export function saveStoredContactSettings(settings: ContactSettings) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("gscsc_contact_settings", JSON.stringify(settings));
      window.dispatchEvent(new Event("gscsc_contact_settings_updated"));
    } catch (err) {
      console.error(err);
    }
  }
}
