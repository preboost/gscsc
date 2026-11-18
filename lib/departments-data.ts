export interface DepartmentItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  activities: string[];
  display_order: number;
}

export const DEFAULT_DEPARTMENTS: DepartmentItem[] = [
  {
    id: "robotics",
    title: "Robotics & Rocketry",
    desc: "Engineering autonomous line-followers, soccer bots, drones, model rocketry, and high-altitude atmospheric experiments.",
    image: "https://images.unsplash.com/photo-1517976487507-5b3b11329582?auto=format&fit=crop&q=80&w=1200",
    activities: [
      "Microcontroller programming & sensor fusion",
      "Mission control design and circuit simulations",
      "National & international collegiate competitions",
      "Solid-propellant model rocket construction",
    ],
    display_order: 1,
  },
  {
    id: "olympiad",
    title: "Olympiad Circuit",
    desc: "Training champions for National Physics, Math, Chemistry, Astronomy and Informatics Olympiads with proven results.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
    activities: [
      "Advanced problem-solving sessions",
      "National olympiad preparation bootcamps",
      "Peer mentorship from former medalists",
      "Mock Olympiad examinations",
    ],
    display_order: 2,
  },
  {
    id: "research",
    title: "Project Display & Research Paper",
    desc: "Conducting scientific research, writing formal papers, and building dynamic working prototypes for national presentations.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200",
    activities: [
      "Scientific research methodology workshops",
      "Model & hardware project exhibitions",
      "Publication formatting and presentation skills",
      "National competition project preparation",
    ],
    display_order: 3,
  },
  {
    id: "it",
    title: "Information Technology (IT)",
    desc: "Managing club web platforms, registration portals, competitive programming contests, and digital infrastructure.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
    activities: [
      "Web application & portal development",
      "Competitive programming contests",
      "Database and server administration",
      "Digital registration and member management",
    ],
    display_order: 4,
  },
  {
    id: "quizzing",
    title: "Quizzing Circuit",
    desc: "Sharpening competitive intellect across general science, physics, chemistry, biology, and history of science.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
    activities: [
      "Inter-college quiz tournament preparation",
      "Intra-college quiz tournaments",
      "Contest trials and knowledge leagues",
      "Quiz master training and question writing",
    ],
    display_order: 5,
  },
  {
    id: "photography",
    title: "Photography & Media",
    desc: "Capturing astronomical observations, microscopic captures, event cinematography, and rich visual storytelling archives.",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=1200",
    activities: [
      "Event documentation and media coverage",
      "Drone, model rocketry, and atmosphere shoots",
      "Digital media content production",
      "Astronomy photography and astrophotography",
    ],
    display_order: 6,
  },
  {
    id: "press",
    title: "Press & Publications",
    desc: "Official voice of the club, responsible for science newsletters, magazines, press releases, and festival coverage.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200",
    activities: [
      "Annual club science magazine 'Anuronon'",
      "Photo release and bulletin boards",
      "Interviews with scientists and alumni",
      "Festival press coverage and documentation",
    ],
    display_order: 7,
  },
  {
    id: "science",
    title: "Science Affairs",
    desc: "Organizing nationwide science carnivals, inter-college olympiads, interactive workshops, and science exhibitions.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
    activities: [
      "Annual National Science & Technology Festival logistics",
      "Hands-on science experiments and demonstrations",
      "Scientific talk shows and guest seminars",
      "Cross-college coordination for science delegations",
    ],
    display_order: 8,
  },
  {
    id: "magazine",
    title: "Wall Magazine & Scrapbook",
    desc: "Creative visual science storytelling combining artistic infographics, scientific literature, and historical timelines.",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1200",
    activities: [
      "Periodic wall magazine curation",
      "Theme-based artwork and illustration",
      "Creative scientific editorial design",
      "Annual scrapbook compilation",
    ],
    display_order: 9,
  },
  {
    id: "pr",
    title: "Public Relations",
    desc: "Connecting GSCSC with partner schools, universities, industry mentors, media institutions, and national sponsors.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200",
    activities: [
      "Media outreach across Bangladesh",
      "Partnership and sponsor coordination",
      "Festival delegate management",
      "Inter-club collaboration programs",
    ],
    display_order: 10,
  },
];

export function getStoredDepartments(): DepartmentItem[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_departments");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));
        }
      }
    } catch {}
  }
  return DEFAULT_DEPARTMENTS;
}

export async function fetchCloudDepartments(): Promise<DepartmentItem[]> {
  if (typeof window === "undefined") return DEFAULT_DEPARTMENTS;
  try {
    const res = await fetch("/api/sync?key=departments", {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
    });
    if (res.ok) {
      const json = await res.json();
      const list = Array.isArray(json)
        ? json
        : (json?.data && Array.isArray(json.data) ? json.data : null);

      if (Array.isArray(list) && list.length > 0) {
        try {
          localStorage.setItem("gscsc_departments", JSON.stringify(list));
        } catch {}
        window.dispatchEvent(new Event("gscsc_departments_updated"));
        return list.sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));
      }
    }
  } catch (err) {
    console.warn("Could not fetch cloud departments:", err);
  }
  return getStoredDepartments();
}

export function saveStoredDepartments(items: DepartmentItem[]) {
  if (typeof window !== "undefined") {
    // Sync to Cloudflare KV edge
    fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "departments", data: items }),
    }).catch((err) => console.warn("Cloud sync error for departments:", err));

    try {
      localStorage.setItem("gscsc_departments", JSON.stringify(items));
      window.dispatchEvent(new Event("gscsc_departments_updated"));
    } catch (err) {
      console.error(err);
    }
  }
}
