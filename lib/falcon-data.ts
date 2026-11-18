export interface FalconRocket {
  id: string;
  name: string;
  year: string;
  apogee: string;
  propellant: string;
  status: string;
  desc: string;
  image?: string;
  display_order: number;
}

export interface FalconSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
}

export const DEFAULT_FALCON_SLIDES: FalconSlide[] = [
  {
    id: "slide-1",
    title: "Falcon-II Launch Pad & Static Hot-Fire Test",
    subtitle: "High-power solid composite rocket motor static test firing achieving 1,240m apogee certification.",
    image: "https://images.unsplash.com/photo-1517976487507-5b3b11329582?auto=format&fit=crop&q=80&w=1200",
    badge: "FLIGHT TESTED • 1.24 KM APOGEE",
  },
  {
    id: "slide-2",
    title: "Avionics, BMP280 Barometer & GPS Telemetry Integration",
    subtitle: "In-house soldered microcontroller telemetry stack broadcasting 915 MHz real-time telemetry to Ground Station.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    badge: "GROUND TELEMETRY & AVIONICS",
  },
  {
    id: "slide-3",
    title: "Falcon-III Dual-Stage Tropospheric Research Vehicle",
    subtitle: "Advanced solid propellant grain geometry and aerodynamic fin flutter computational simulations for 2.5 km target.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    badge: "CAD & WIND TUNNEL SIMULATION",
  },
  {
    id: "slide-4",
    title: "Dual-Chute Pyrotechnic Parachute Ejection System",
    subtitle: "Drogue and main parachute dual-deployment avionics charge ensuring 100% undamaged recovery in field trials.",
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=1200",
    badge: "RECOVERY ARCHITECTURE",
  },
  {
    id: "slide-5",
    title: "Solid Composite Propellant Hot-Fire Static Thrust Bench",
    subtitle: "Load cell thrust curve validation proving 120 Newton peak impulse for subscale atmospheric probes.",
    image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&q=80&w=1200",
    badge: "PROPULSION D-CLASS STATIC",
  },
  {
    id: "slide-6",
    title: "CanSat Miniaturized Atmospheric Sensor Suite",
    subtitle: "Integrated pressure, humidity, UV index, and air quality telemetry probe aboard Falcon sounding missions.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200",
    badge: "CANSAT PAYLOAD INTEGRATION",
  },
  {
    id: "slide-7",
    title: "Mission Control Ground Telemetry Station",
    subtitle: "Long-range directional Yagi antenna and LoRa RF modem logging continuous flight altitude data.",
    image: "https://images.unsplash.com/photo-1457364887197-9150188c107b?auto=format&fit=crop&q=80&w=1200",
    badge: "GROUND STATION 915 MHZ",
  },
  {
    id: "slide-8",
    title: "High-Altitude Sounding Launch Trajectory",
    subtitle: "Vertical flight path tracking and active aerodynamic recovery deployed at peak apogee over launch range.",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=1200",
    badge: "APOGEE TRAJECTORY LOG",
  },
];

export const DEFAULT_FALCON_FLEET: FalconRocket[] = [
  {
    id: "falcon-1",
    name: "Falcon-I (Subscale Demonstrator)",
    year: "2022",
    apogee: "450 meters",
    propellant: "Sugar / KNO3 (KNSB)",
    status: "Successful Flight & Recovery",
    desc: "First successful flight test proving aerodynamic stability, passive fin guidance, and pyrotechnic recovery deployment.",
    display_order: 1,
  },
  {
    id: "falcon-2",
    name: "Falcon-II (Atmospheric Sounding Probe)",
    year: "2023–24",
    apogee: "1,240 meters (1.24 km)",
    propellant: "Aerotech Commercial Composite D-Class",
    status: "National Champion – Science Fair '24",
    desc: "High-altitude sounding mission featuring onboard atmospheric pressure logging, IMU sensor suite, and GPS recovery beacons.",
    display_order: 2,
  },
  {
    id: "falcon-3",
    name: "Falcon-III (Tropospheric Research Vehicle)",
    year: "2025 (In Development)",
    apogee: "2,500 meters (Target)",
    propellant: "Dual-grain solid composite",
    status: "Wind Tunnel & CAD Stage",
    desc: "Next-generation multi-stage sounding rocket designed to carry a miniaturized CanSat payload for humidity and air quality mapping.",
    display_order: 3,
  },
];

export function getStoredFalconFleet(): FalconRocket[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_falcon_fleet");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => (Number(a.display_order) || 99) - (Number(b.display_order) || 99));
        }
      }
    } catch {}
  }
  return DEFAULT_FALCON_FLEET;
}

export function saveStoredFalconFleet(fleet: FalconRocket[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("gscsc_falcon_fleet", JSON.stringify(fleet));
      window.dispatchEvent(new Event("gscsc_falcon_fleet_updated"));
    } catch (e) {
      console.error(e);
    }
  }
}

export function getStoredFalconSlides(): FalconSlide[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gscsc_falcon_slides");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
  }
  return DEFAULT_FALCON_SLIDES;
}

export function saveStoredFalconSlides(slides: FalconSlide[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("gscsc_falcon_slides", JSON.stringify(slides));
      window.dispatchEvent(new Event("gscsc_falcon_slides_updated"));
    } catch (e) {
      console.error(e);
    }
  }
}
