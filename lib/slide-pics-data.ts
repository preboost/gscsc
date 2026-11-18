export interface SlidePicItem {
  id: string;
  title: string;
  caption?: string;
  image: string;
  badge?: string;
  display_order: number;
}

export const DEFAULT_SLIDE_PICS: SlidePicItem[] = [
  {
    id: "sp-1",
    title: "12th National Science Carnival Opening Ceremony",
    caption: "Over 3,000 delegates gathering at Govt. Science College auditorium.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
    badge: "ANNUAL CARNIVAL",
    display_order: 1,
  },
  {
    id: "sp-2",
    title: "Falcon-II Sounding Rocket Field Launch",
    caption: "Successful solid-propellant motor ignition and 1.24 km apogee flight.",
    image: "/events/event-2.jpg",
    badge: "GSC FALCON",
    display_order: 2,
  },
  {
    id: "sp-3",
    title: "National Physics & Math Olympiad Camp",
    caption: "Intensive peer problem-solving sessions led by national medalists.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
    badge: "OLYMPIAD BOOTCAMP",
    display_order: 3,
  },
  {
    id: "sp-4",
    title: "Autonomous Robotics & Microcontroller Lab",
    caption: "Line-following robot tuning and sensor calibration for national tournaments.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    badge: "ROBOTICS LAB",
    display_order: 4,
  },
  {
    id: "sp-5",
    title: "Chemical Kinetics & Lab Research Demonstration",
    caption: "Students performing spectrochemical analysis and reaction kinetics experiments.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200",
    badge: "RESEARCH PAPER",
    display_order: 5,
  },
  {
    id: "sp-6",
    title: "Deep-Sky Astrophotography & Stargazing Night",
    caption: "Observation camp capturing lunar craters and planetary alignments.",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=1200",
    badge: "ASTROPHOTOGRAPHY",
    display_order: 6,
  },
  {
    id: "sp-7",
    title: "Inter-College Science Quiz Championship Finals",
    caption: "High-octane buzzers and buzzer rounds in general science and physics.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
    badge: "QUIZ CIRCUIT",
    display_order: 7,
  },
  {
    id: "sp-8",
    title: "IT & Competitive Programming Sprint",
    caption: "Algorithm design, web portal architecture, and rapid prototyping.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
    badge: "IT WING",
    display_order: 8,
  },
];

export function getStoredSlidePics(): SlidePicItem[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_slide_pics");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));
        }
      }
    } catch {}
  }
  return DEFAULT_SLIDE_PICS;
}

export function saveStoredSlidePics(pics: SlidePicItem[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("gscsc_slide_pics", JSON.stringify(pics));
      window.dispatchEvent(new Event("gscsc_slide_pics_updated"));
    } catch (e) {
      console.error(e);
    }
  }
}
