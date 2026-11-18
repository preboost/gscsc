export interface ProjectItem {
  id: string;
  title: string;
  tag: string;
  year: string;
  image?: string;
  desc: string;
  specs: string[];
  team: string;
  status: "Competed" | "Prototype" | "Published" | "National Award" | "Deployed";
  display_order: number;
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    title: "High-Altitude Atmospheric Sounding Rocket",
    tag: "Rocketry Wing",
    year: "2023–24",
    image: "https://images.unsplash.com/photo-1517976487507-5b3b11329582?auto=format&fit=crop&q=80&w=1200",
    desc: "Custom solid-motor model rocket engineered for a 1.2 km apogee. Features a dual-parachute recovery system, onboard telemetry logging via Arduino, and barometric pressure data collection for atmospheric science research.",
    specs: ["Apogee: ~1.2 km", "Motor: D-class solid propellant", "Recovery: Dual-chute deployment", "Telemetry: BMP280 + GPS module"],
    team: "Rocketry & Robotics Wing",
    status: "Competed",
    display_order: 1,
  },
  {
    id: "proj-2",
    title: "Autonomous Agricultural Drone & Terrain Rover",
    tag: "Robotics Wing",
    year: "2023–24",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
    desc: "A computer-vision powered soil analysis system combining a quadrotor drone and ground rover. Uses spectral imaging and edge ML to detect nitrogen deficiency in crops. Developed with OpenCV and Raspberry Pi CM4.",
    specs: ["Platform: Raspberry Pi CM4 + Pi Camera", "Algorithm: OpenCV + TFLite classifier", "Accuracy: 87% field test validation", "Coverage: ~5 acres/hr (drone)"],
    team: "Robotics Wing",
    status: "Prototype",
    display_order: 2,
  },
  {
    id: "proj-3",
    title: "Cosmic Ray Muon Detection via Scintillator Grid",
    tag: "Physics Research",
    year: "2022–23",
    image: "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&q=80&w=1200",
    desc: "A silicon photomultiplier (SiPM) based modular particle detector for measuring secondary cosmic ray muon flux at sea level. Designed to be replicable in high schools with low-cost components and open-source firmware.",
    specs: ["Sensor: SiPM array (6×6 grid)", "Coincidence window: 100 ns", "Muon flux: ~1 cm⁻²·min⁻¹ sea level", "Open-source firmware: MuonPi fork"],
    team: "Physics Research Division",
    status: "Published",
    display_order: 3,
  },
  {
    id: "proj-4",
    title: "Bio-Plastic Synthesis from Agricultural Waste",
    tag: "Green Science",
    year: "2023",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200",
    desc: "Producing biodegradable PHA-based bioplastics from banana-peel cellulose and rice-husk silica. The methodology focuses on reducing single-use plastic dependency using locally sourced agricultural by-products at room temperature.",
    specs: ["Base material: Banana peel cellulose", "Additive: Rice husk silica (amorphous)", "Degradation: ~90 days in soil", "Tensile strength: 18.4 MPa"],
    team: "Chemistry Research Wing",
    status: "National Award",
    display_order: 4,
  },
  {
    id: "proj-5",
    title: "Smart Blind Assistance Visor",
    tag: "AI & IoT",
    year: "2024",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200",
    desc: "A Raspberry Pi-powered wearable visor with real-time obstacle detection using ultrasonic + IR sensors, haptic feedback belt motors, and voice navigation output. Designed for cost-effective assistive technology deployment.",
    specs: ["MCU: Raspberry Pi Zero 2W", "Sensors: HC-SR04 + IR grid", "Output: Haptic + Text-to-Speech (gTTS)", "Battery: 5000 mAh LiPo (8hr)"],
    team: "IT Wing & Science Affairs",
    status: "Prototype",
    display_order: 5,
  },
  {
    id: "proj-6",
    title: "Automated Smart Greenhouse System",
    tag: "Agri-Tech",
    year: "2024",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&q=80&w=1200",
    desc: "An IoT-enabled climate-controlled greenhouse using capacitive soil moisture sensors, automated drip irrigation relays, CO₂ monitors, and an ML-driven optimization algorithm running on a local edge server.",
    specs: ["Sensors: DHT22, MH-Z19 CO₂, Capacitive moisture", "Irrigation: 4-zone drip relay control", "Controller: ESP32 + MQTT broker", "ML: TensorFlow Lite regression model"],
    team: "Robotics & IT Wings",
    status: "Deployed",
    display_order: 6,
  },
];

export function getStoredProjects(): ProjectItem[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_projects");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));
        }
      }
    } catch {}
  }
  return DEFAULT_PROJECTS;
}

export function saveStoredProjects(items: ProjectItem[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("gscsc_projects", JSON.stringify(items));
      window.dispatchEvent(new Event("gscsc_projects_updated"));
    } catch (err) {
      console.error(err);
    }
  }
}
