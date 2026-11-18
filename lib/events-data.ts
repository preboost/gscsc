export interface ClubEvent {
  id: number;
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  duration?: string;
  location: string;
  banner_url: string;
  image_url?: string;
  is_upcoming: boolean;
  is_active: boolean;
  registration_link?: string;
  description: string;
  full_story?: string[];
  segments?: string[];
  gallery?: { url: string; caption: string }[];
}

export const EVENTS_DATA: ClubEvent[] = [
  {
    id: 1,
    title: "12th National Science & Tech Carnival 2025",
    subtitle: "Bangladesh's Premier Collegiate Science Festival",
    category: "National Flagship",
    date: "March 15–17, 2025",
    duration: "3-Day Nationwide Festival",
    location: "Govt. Science College Campus, Tejgaon, Dhaka",
    banner_url: "/events/event-1.jpg",
    is_upcoming: true,
    is_active: true,
    registration_link: "https://forms.gle/gscsc-carnival-2025",
    description: "Bangladesh's premier collegiate science festival featuring 18 competitive segments, including Project Display, Rocketry, Robotics, Informatics, and Olympiads.",
    full_story: [
      "Calling all the curious minds and visionary innovators of Bangladesh! Govt. Science College Science Club proudly presents the 12th National Science & Tech Carnival 2025 — the nation's benchmark platform for collegiate scientific excellence.",
      "Over the course of three exhilarating days, more than 4,000 delegates from over 150 schools, colleges, and universities across Bangladesh will converge at our historic Tejgaon campus to compete, present, and push the boundaries of scientific inquiry.",
      "From high-altitude model rocketry static firings to autonomous robotic line-followers, advanced AI algorithms, and grueling olympiad circuits across Physics, Math, and Chemistry, the 12th National Carnival is where passion transforms into discovery."
    ],
    segments: [
      "GSC Falcon Rocketry Exhibition",
      "Collegiate Robotics Battle Royale",
      "Science Project Display (Senior & Junior)",
      "National Science Olympiad (Phy, Chem, Math, Bio, Astro)",
      "Scientific Wall Magazine & Scrapbook",
      "Scientific Paper & Research Presentation",
      "Informatics & Algorithmic Programming Contest"
    ],
    gallery: [
      {
        url: "/events/event-1.jpg",
        caption: "Opening Ceremony and delegate assembly at the college auditorium"
      },
      {
        url: "/events/event-3.jpg",
        caption: "Rocketry and avionics flight instrumentation review"
      }
    ]
  },
  {
    id: 2,
    title: "GSC Falcon Sounding Rocket Workshop & Static Test",
    subtitle: "Aerospace Propulsion & High-Altitude Telemetry Bootcamp",
    category: "Rocketry Workshop",
    date: "April 05, 2025",
    duration: "Full-Day Hands-on Session",
    location: "Aerospace Propulsion Lab & College Field",
    banner_url: "/events/event-2.jpg",
    is_upcoming: true,
    is_active: true,
    registration_link: "https://forms.gle/falcon-workshop-2025",
    description: "Hands-on model rocketry simulation, solid propellant motor chemistry, safety protocols, and live payload data acquisition workshop.",
    full_story: [
      "The GSC Falcon Aerospace & Rocketry Division hosts a groundbreaking masterclass designed to take aspiring student rocketeers from flight computer trajectory simulations to live static propulsion firings.",
      "Participants will gain practical experience designing aerodynamic airframes in OpenRocket, calibrating barometric altimeters and BMP280 sensors, and reviewing KNSu solid propellant formulation safety compliance."
    ],
    segments: [
      "Solid Propellant Motor Formulation & Grain Geometry",
      "OpenRocket & Numerical Apogee Computation",
      "Dual-Deployment Parachute Ejection Charges",
      "Live Static Motor Test on Load Cell Stand"
    ],
    gallery: [
      {
        url: "/events/event-2.jpg",
        caption: "Falcon Sounding Rocket airframe integration"
      }
    ]
  },
  {
    id: 3,
    title: "11th National Science & Tech Festival",
    subtitle: "Celebrating 42 Years of Collegiate Scientific Leadership",
    category: "National Festival",
    date: "December 2023",
    duration: "3-Day Annual Carnival",
    location: "Govt. Science College, Dhaka",
    banner_url: "/events/event-3.jpg",
    is_upcoming: false,
    is_active: true,
    description: "Over 3,500 delegates from 120+ institutions across Bangladesh competed in model making, science quiz, and Olympiad circuits.",
    full_story: [
      "The 11th National Science & Tech Festival was one of the largest student science gatherings in Bangladesh. Organized entirely by student executives under the guidance of our college faculty, the festival brought together over 3,500 students from 120+ institutions across the country.",
      "Spanning 16 intense competition segments over 3 packed days, participants showcased real-world innovations including automated flood rescue drones, eco-friendly bioplastics, smart IoT agriculture controllers, and biomedical monitoring systems.",
      "The event concluded with a grand closing and award ceremony presided over by distinguished scientists, university deans, and GSCSC alumni mentors."
    ],
    segments: [
      "Inter-College Science Project Showcase",
      "Mega Science Quiz Circuit",
      "General Knowledge Olympiad",
      "Astronomy & Planetary Science Exhibition",
      "Robotics Demonstration & Obstacle Course"
    ],
    gallery: [
      {
        url: "/events/event-3.jpg",
        caption: "Crowded festival arena during project exhibition rounds"
      }
    ]
  },
  {
    id: 4,
    title: "38th Intra-College Science Festival",
    subtitle: "Nurturing the Next Generation of College Scientists",
    category: "Intra College",
    date: "September 2024",
    duration: "2-Day Campus Event",
    location: "College Auditorium & Laboratories",
    banner_url: "/events/event-4.jpg",
    is_upcoming: false,
    is_active: true,
    description: "The annual platform unveiling the scientific spark of newly enrolled first-year intermediate students.",
    full_story: [
      "Every year, the Intra-College Science Festival welcomes hundreds of newly enrolled first-year students of Govt. Science College into the world of scientific research and competitive presentation.",
      "The 38th edition featured intra-college olympiads in Physics, Chemistry, and Biology, along with laboratory demonstration contests, creative problem solving, and science fiction writing competitions."
    ],
    segments: [
      "Intra-College Science Quiz",
      "First-Year Project Demonstrations",
      "Sudoku & Cryptic Math Challenge",
      "Science Fiction Writing & Concept Art"
    ],
    gallery: [
      {
        url: "/events/event-4.jpg",
        caption: "First-year intermediate students demonstrating laboratory experiments"
      }
    ]
  }
];

export function cleanIconText(text?: string): string {
  if (!text) return "";
  try {
    const rx = new RegExp("^[\\s\\p{Extended_Pictographic}\\uFE00-\\uFE0F\\u200D\\u25A0-\\u2BFF\\u2300-\\u23FF\\u2600-\\u27BF]+", "gu");
    return text.replace(rx, "").trim();
  } catch {
    return text.replace(/^(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|[\uFE00-\uFE0F]|\s)+/, "").trim();
  }
}

export function getStoredEvents(): ClubEvent[] {
  if (typeof window === "undefined") return EVENTS_DATA;
  try {
    const raw = localStorage.getItem("gscsc_events");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading gscsc_events:", e);
  }
  return EVENTS_DATA;
}

export async function fetchCloudEvents(): Promise<ClubEvent[]> {
  if (typeof window === "undefined") return EVENTS_DATA;
  try {
    const res = await fetch("/api/events", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
      },
    });
    if (res.ok) {
      const json = await res.json();
      const list = Array.isArray(json)
        ? json
        : json?.data && Array.isArray(json.data)
        ? json.data
        : null;

      if (Array.isArray(list) && list.length > 0) {
        try {
          localStorage.setItem("gscsc_events", JSON.stringify(list));
        } catch (e) {}
        window.dispatchEvent(new Event("gscsc_events_updated"));
        return list;
      }
    }
  } catch (err) {
    console.warn("Could not fetch events from cloud API, falling back to local/default:", err);
  }
  return getStoredEvents();
}

export async function syncEventsToCloud(events: ClubEvent[]): Promise<boolean> {
  try {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(events),
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to sync events to Cloudflare KV:", err);
    return false;
  }
}

export function saveStoredEvents(events: ClubEvent[]): boolean {
  if (typeof window === "undefined") return false;

  // Immediately push to cloud KV so changes are live for all devices globally
  syncEventsToCloud(events).catch((err) => {
    console.warn("Background cloud sync error:", err);
  });

  try {
    localStorage.setItem("gscsc_events", JSON.stringify(events));
    window.dispatchEvent(new Event("gscsc_events_updated"));
    if (typeof BroadcastChannel !== "undefined") {
      try {
        const bc = new BroadcastChannel("gscsc_events_broadcast");
        bc.postMessage({ type: "events_updated" });
        bc.close();
      } catch {}
    }
    return true;
  } catch (e) {
    console.warn("Storage quota exceeded or error, attempting optimization...", e);
    try {
      // If quota exceeded due to large base64 banner images, optimize by keeping first 50KB or fallback
      const safeEvents = events.map((ev) => {
        let banner = ev.banner_url || (ev as any).image_url || "/events/event-1.jpg";
        if (banner.startsWith("data:") && banner.length > 50000) {
          banner = "/events/event-1.jpg";
        }
        return {
          ...ev,
          banner_url: banner,
          image_url: banner,
        };
      });
      localStorage.setItem("gscsc_events", JSON.stringify(safeEvents));
      window.dispatchEvent(new Event("gscsc_events_updated"));
      return true;
    } catch (err2) {
      console.error("Fatal error saving events to localStorage:", err2);
      return false;
    }
  }
}
