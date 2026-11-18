"use client";

// Default About & Founder Data
export interface AboutData {
  establishedYear: number;
  clubTitle: string;
  heroStory: string;
  mission: string;
  vision: string;
  founderName: string;
  founderTitle: string;
  founderPhoto: string;
  founderBio: string;
  founderQuote: string;
}

export const DEFAULT_ABOUT: AboutData = {
  establishedYear: 1981,
  clubTitle: "Govt. Science College Science Club (GSCSC)",
  heroStory: "Founded in 1981 at Govt. Science College, Tejgaon, Dhaka, GSCSC has stood as the torchbearer of rational thinking, scientific experimentation, and youth leadership in Bangladesh for over 44 years.",
  mission: "To ignite the curiosity of students, empower them with hands-on research and engineering skills, and represent Bangladesh on global scientific platforms.",
  vision: "To cultivate the next generation of pioneering scientists, astrophysicists, engineers, and changemakers who will lead mankind towards a technological renaissance.",
  founderName: "Prof. Santosh Kumar Roy",
  founderTitle: "Founding Patron & Former Head of Science, GSC (1981)",
  founderPhoto: "/founder-santosh-kumar-roy.jpg",
  founderBio: "In 1981, Prof. Santosh Kumar Roy envisioned a haven within Govt. Science College where students could experiment beyond rote textbooks. Gathering a handful of passionate science enthusiasts in the old college laboratory, he established what would become one of Bangladesh's most celebrated student science bodies.",
  founderQuote: "Science is not merely a subject inside a curriculum; it is the ultimate compass of human civilization. If you teach young minds to question with rigor, they will illuminate the universe."
};

// Achievements Data
export interface AchievementItem {
  id: number;
  title: string;
  year: string;
  category: string;
  awardBy: string;
  description: string;
  image_url?: string;
}

export const DEFAULT_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 1,
    title: "National Champion – National Science Fair",
    year: "2024",
    category: "Aerospace & Rocketry",
    awardBy: "Ministry of Science & Technology, Bangladesh",
    description: "Awarded 1st place nationwide for the GSC Falcon Solid-Propellant Atmospheric Sounding Rocket Project.",
    image_url: "https://images.unsplash.com/photo-1517976487507-5b3b11329582?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Gold Medal – National Physics Olympiad",
    year: "2023",
    category: "Olympiad Circuit",
    awardBy: "Bangladesh Physics Olympiad Committee",
    description: "GSCSC team swept multiple division medals and represented Bangladesh at the International Physics Olympiad.",
    image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Best Collegiate Science Club of the Year",
    year: "2022",
    category: "Institutional Excellence",
    awardBy: "National Museum of Science & Technology",
    description: "Recognized for organizing the 11th National Science & Tech Carnival hosting over 120+ educational institutions.",
    image_url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Champion – Collegiate Robotics Battle Royale",
    year: "2023",
    category: "Autonomous Robotics",
    awardBy: "BUET Robotics Society",
    description: "Custom line-following and obstacle-navigation automated bot designed by GSCSC Robotics Wing took top podium.",
    image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Outstanding Youth Research Publication Award",
    year: "2024",
    category: "Green Technology",
    awardBy: "Bangladesh Association for the Advancement of Science",
    description: "Student research paper on biodegradable bioplastics synthesized from agricultural banana cellulose.",
    image_url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=800&auto=format&fit=crop",
  }
];

// GSC Falcon Aerospace Data
export interface FalconData {
  title: string;
  subtitle: string;
  missionOverview: string;
  apogeeRecord: string;
  propellantType: string;
  telemetrySpecs: string;
  recoverySystem: string;
  upcomingMission: string;
}

export const DEFAULT_FALCON: FalconData = {
  title: "GSC Falcon — Advanced Rocketry & Aerospace Wing",
  subtitle: "Pioneering high-altitude sounding rockets, autonomous telemetry capsules, and atmospheric research at Govt. Science College.",
  missionOverview: "Founded under GSCSC's Robotics & Rocketry Department, GSC Falcon is Bangladesh's pioneering high-school & collegiate amateur aerospace initiative. The wing designs, simulates, manufactures, and static-tests custom solid-rocket motors and high-altitude research probes.",
  apogeeRecord: "1.24 Kilometers (4,068 ft)",
  propellantType: "Potassium Nitrate / Sorbitol (KNSB) & Commercial D-Class solid grains",
  telemetrySpecs: "915 MHz Long-Range RF Link, BMP280 Barometric Altimeter, 6-DoF IMU & GPS logging",
  recoverySystem: "Dual-deployment drogue & main chute with barometric pyrotechnic charges",
  upcomingMission: "Falcon-III Sounding Probe targeting 2.5 km tropospheric atmospheric pressure mapping."
};

// Helper to get / set from localStorage (client-side) with fallback
export function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(`gscsc_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`gscsc_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
}
