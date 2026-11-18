export interface WorkshopItem {
  id: string;
  title: string;
  badge: string;
  badgeColor?: string;
  image: string;
  date: string;
  time: string;
  location: string;
  lead: string;
  desc: string;
  topics: string[];
  regLink: string;
  status: "Registration Open" | "Upcoming" | "Completed";
  display_order: number;
}

export const DEFAULT_WORKSHOPS: WorkshopItem[] = [
  {
    id: "falcon-rocketry",
    title: "GSC Falcon: Solid Rocketry & Trajectory Simulation",
    badge: "AEROSPACE & PROPULSION",
    badgeColor: "border-red-500/30 bg-red-950/40 text-rose-300",
    image: "https://images.unsplash.com/photo-1517976487507-5b3b11329582?q=80&w=1200&auto=format&fit=crop",
    date: "April 05, 2025",
    time: "10:00 AM – 4:00 PM",
    location: "Aerospace Lab & College Field",
    lead: "GSC Falcon Research Team",
    desc: "An intensive masterclass covering atmospheric sounding rocket aerodynamics, KNSu propellant motor formulation, OpenRocket flight simulations, and live static thrust stand test protocols.",
    topics: [
      "Aerodynamic stability & center of pressure vs center of gravity",
      "OpenRocket CAD simulation & numerical apogee prediction",
      "Solid propellant grain casting & nozzle throat geometry",
      "Barometric altimeter & dual-deploy parachute ejection systems",
    ],
    regLink: "https://forms.gle/falcon-workshop-2025",
    status: "Registration Open",
    display_order: 1,
  },
  {
    id: "autonomous-robotics",
    title: "Autonomous Robotics & Microcontroller Architecture",
    badge: "ROBOTICS & EMBEDDED SYSTEMS",
    badgeColor: "border-sky-500/30 bg-sky-950/40 text-sky-300",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    date: "May 12, 2025",
    time: "11:00 AM – 3:30 PM",
    location: "Hardware & Robotics Lab",
    lead: "Robotics Wing Executive Panel",
    desc: "Learn microcontroller firmware development from scratch. Build high-speed line following bots, obstacle evasion logic, and wireless Bluetooth/ESP-NOW telemetry links.",
    topics: [
      "ESP32 & Arduino architecture & pulse-width modulation (PWM)",
      "PID tuning for precision line-tracking at speed",
      "Ultrasonic, infrared, and optical sensor calibration",
      "Motor driver circuit design & LiPo battery management",
    ],
    regLink: "https://forms.gle/robotics-workshop-2025",
    status: "Registration Open",
    display_order: 2,
  },
  {
    id: "astrophotography-telescopy",
    title: "Night Sky Observation & Astrophotography Masterclass",
    badge: "ASTRONOMY & OPTICS",
    badgeColor: "border-indigo-500/30 bg-indigo-950/40 text-indigo-300",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop",
    date: "June 20, 2025",
    time: "7:00 PM – 11:30 PM",
    location: "College Rooftop Observatory",
    lead: "Astronomy & Astrophysics Wing",
    desc: "Explore deep-sky astrophotography using equatorial tracking mounts, motorized Schmidt-Cassegrain telescopes, and long-exposure image processing techniques.",
    topics: [
      "Telescope optics: Refractor vs Reflector vs Cassegrain",
      "Equatorial mount polar alignment & sidereal tracking",
      "Capturing deep-sky nebulae, star clusters & lunar craters",
      "Stacking calibration frames (Dark, Flat, Bias) in Siril",
    ],
    regLink: "https://forms.gle/astronomy-workshop-2025",
    status: "Upcoming",
    display_order: 3,
  },
  {
    id: "python-scientific",
    title: "Python for Scientific Computing & Data Modeling",
    badge: "INFORMATICS & AI",
    badgeColor: "border-emerald-500/30 bg-emerald-950/40 text-emerald-300",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    date: "July 08, 2025",
    time: "2:00 PM – 6:00 PM",
    location: "Computer Center Lab 2",
    lead: "IT & Computational Science Wing",
    desc: "Leverage Python to analyze laboratory data, simulate dynamical systems, fit regression curves, and generate publication-ready vector figures.",
    topics: [
      "NumPy & vectorized linear algebra calculations",
      "Numerical integration of differential equations with SciPy",
      "Data visualization with Matplotlib & Seaborn",
      "Deploying lightweight machine learning models for classification",
    ],
    regLink: "https://forms.gle/python-workshop-2025",
    status: "Upcoming",
    display_order: 4,
  },
];

export function getStoredWorkshops(): WorkshopItem[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_workshops");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));
        }
      }
    } catch {}
  }
  return DEFAULT_WORKSHOPS;
}

export function saveStoredWorkshops(items: WorkshopItem[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("gscsc_workshops", JSON.stringify(items));
      window.dispatchEvent(new Event("gscsc_workshops_updated"));
    } catch (err) {
      console.error(err);
    }
  }
}
