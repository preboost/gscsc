export interface PublicationItem {
  id: string;
  year: string;
  edition: string;
  bengali: string;
  type: string;
  coverImage?: string;
  description: string;
  pages: string;
  downloadUrl?: string;
  display_order: number;
}

export interface FeaturedPublication {
  badge: string;
  tag: string;
  bengaliTitle: string;
  englishTitle: string;
  subtitle: string;
  specialIssue: string;
  description: string;
  statusText: string;
  statusSubtext: string;
  coverImage?: string;
  downloadUrl?: string;
}

export const DEFAULT_FEATURED_PUBLICATION: FeaturedPublication = {
  badge: "Flagship Science Anthology",
  tag: "FLAGSHIP 2026",
  bengaliTitle: "সবিকল্প ২০২৬",
  englishTitle: "Shobikolpo 2026",
  subtitle: "Annual Flagship Science Magazine",
  specialIssue: "Orbitfall Protocol",
  description: "Shobikolpo, the annual science publication of the Govt. Science College Science Club, is a vibrant reflection of the curiosity, passion, and intellectual spirit of our student researchers and scientists. More than a collection of student writings, it serves as a platform where research, analysis, model rocketry data, and innovative ideas extend beyond the classroom to reach a wider audience.",
  statusText: "Coming Soon",
  statusSubtext: "Currently in Editorial & Print Phase",
  coverImage: "",
  downloadUrl: "",
};

export const DEFAULT_PUBLICATIONS: PublicationItem[] = [
  {
    id: "pub-2024",
    year: "2024",
    edition: "Shobikolpo 2024",
    bengali: "সবিকল্প ২০২৪",
    type: "Annual Science Journal",
    coverImage: "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&q=80&w=800",
    description: "Featuring peer-reviewed student papers on model rocketry telemetry, CRISPR gene editing, and solar flare coincidences.",
    pages: "148 Pages",
    downloadUrl: "",
    display_order: 1,
  },
  {
    id: "pub-2023",
    year: "2023",
    edition: "Shobikolpo 2023",
    bengali: "সবিকল্প ২০২৩",
    type: "Collegiate Periodical",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    description: "Articles celebrating 42 years of GSCSC, student-built robotics architectures, and National Science Carnival archives.",
    pages: "132 Pages",
    downloadUrl: "",
    display_order: 2,
  },
  {
    id: "pub-2022",
    year: "2022",
    edition: "Anuronon Vol. 32",
    bengali: "অনুরণন খণ্ড ৩২",
    type: "Flagship Edition",
    coverImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    description: "Flagship release including interviews with renowned Bangladeshi astrophysicists and winning Olympiad methodologies.",
    pages: "120 Pages",
    downloadUrl: "",
    display_order: 3,
  },
];

/* ─── Publications List Helpers ─── */

export function getStoredPublications(): PublicationItem[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_publications");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));
        }
      }
    } catch {}
  }
  return DEFAULT_PUBLICATIONS;
}

export async function fetchCloudPublications(): Promise<PublicationItem[]> {
  if (typeof window === "undefined") return DEFAULT_PUBLICATIONS;
  try {
    const res = await fetch("/api/sync?key=publications", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
    });
    if (res.ok) {
      const json = await res.json();
      const list = Array.isArray(json) ? json : (json?.data && Array.isArray(json.data) ? json.data : null);
      if (Array.isArray(list) && list.length > 0) {
        try {
          localStorage.setItem("gscsc_publications", JSON.stringify(list));
        } catch {}
        window.dispatchEvent(new Event("gscsc_publications_updated"));
        return list.sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));
      }
    }
  } catch (err) {
    console.warn("Could not fetch cloud publications:", err);
  }
  return getStoredPublications();
}

export function saveStoredPublications(items: PublicationItem[]): boolean {
  if (typeof window === "undefined") return false;

  // 1. Immediately push full data (including high-res covers) to Cloudflare KV edge database
  fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: "publications", data: items }),
  }).catch((err) => console.warn("Cloud sync error for publications:", err));

  // 2. Persist to browser localStorage with safe quota handling
  try {
    localStorage.setItem("gscsc_publications", JSON.stringify(items));
    window.dispatchEvent(new Event("gscsc_publications_updated"));
    if (typeof BroadcastChannel !== "undefined") {
      try {
        const bc = new BroadcastChannel("gscsc_publications_channel");
        bc.postMessage({ type: "publications_updated" });
        bc.close();
      } catch {}
    }
    return true;
  } catch (err) {
    console.warn("localStorage quota exceeded for publications, applying safe fallback...", err);
    try {
      // If quota exceeded, optimize card covers in local storage cache only
      const safeItems = items.map((p) => {
        let cover = p.coverImage || "";
        if (cover.startsWith("data:") && cover.length > 30000) {
          cover = cover.substring(0, 30000); // truncate for safe local storage
        }
        return { ...p, coverImage: cover };
      });
      localStorage.setItem("gscsc_publications", JSON.stringify(safeItems));
      window.dispatchEvent(new Event("gscsc_publications_updated"));
      return true;
    } catch (e2) {
      console.error("Critical localStorage error for publications:", e2);
      window.dispatchEvent(new Event("gscsc_publications_updated"));
      return false;
    }
  }
}

/* ─── Featured Publication Helpers ─── */

export function getStoredFeaturedPublication(): FeaturedPublication {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_featured_publication");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          return { ...DEFAULT_FEATURED_PUBLICATION, ...parsed };
        }
      }
    } catch {}
  }
  return DEFAULT_FEATURED_PUBLICATION;
}

export async function fetchCloudFeaturedPublication(): Promise<FeaturedPublication> {
  if (typeof window === "undefined") return DEFAULT_FEATURED_PUBLICATION;
  try {
    const res = await fetch("/api/sync?key=featured_publication", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" }
    });
    if (res.ok) {
      const json = await res.json();
      const obj = (json && typeof json === "object" && !Array.isArray(json))
        ? (json.data && typeof json.data === "object" ? json.data : json)
        : null;
      if (obj && (obj.englishTitle || obj.bengaliTitle)) {
        const merged = { ...DEFAULT_FEATURED_PUBLICATION, ...obj };
        try {
          localStorage.setItem("gscsc_featured_publication", JSON.stringify(merged));
        } catch {}
        window.dispatchEvent(new Event("gscsc_featured_publication_updated"));
        return merged;
      }
    }
  } catch (err) {
    console.warn("Could not fetch cloud featured publication:", err);
  }
  return getStoredFeaturedPublication();
}

export function saveStoredFeaturedPublication(featured: FeaturedPublication): boolean {
  if (typeof window === "undefined") return false;

  // Sync to Cloudflare KV edge
  fetch("/api/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: "featured_publication", data: featured }),
  }).catch((err) => console.warn("Cloud sync error for featured publication:", err));

  try {
    localStorage.setItem("gscsc_featured_publication", JSON.stringify(featured));
    window.dispatchEvent(new Event("gscsc_featured_publication_updated"));
    if (typeof BroadcastChannel !== "undefined") {
      try {
        const bc = new BroadcastChannel("gscsc_publications_channel");
        bc.postMessage({ type: "featured_updated" });
        bc.close();
      } catch {}
    }
    return true;
  } catch (err) {
    console.warn("Storage quota exceeded for featured publication:", err);
    try {
      const safeFeatured = { ...featured };
      if (safeFeatured.coverImage && safeFeatured.coverImage.startsWith("data:") && safeFeatured.coverImage.length > 50000) {
        safeFeatured.coverImage = safeFeatured.coverImage.substring(0, 50000);
      }
      localStorage.setItem("gscsc_featured_publication", JSON.stringify(safeFeatured));
      window.dispatchEvent(new Event("gscsc_featured_publication_updated"));
      return true;
    } catch {
      window.dispatchEvent(new Event("gscsc_featured_publication_updated"));
      return false;
    }
  }
}
