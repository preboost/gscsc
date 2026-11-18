export interface Partner {
  id: number;
  name: string;
  type?: string;
  website?: string;
  description?: string;
  logo_url?: string;
  is_active?: boolean;
  created_at?: string;
}

export const DEFAULT_PARTNERS: Partner[] = [
  {
    id: 1,
    name: "Bangladesh Science Society (BSS)",
    type: "Academic Partner",
    website: "https://bss.org.bd",
    description: "National science promotion body collaborating on countrywide science fairs and olympiad mentoring.",
    logo_url: "",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "BUET Science Club",
    type: "Club Partner",
    website: "https://buet.ac.bd",
    description: "Inter-collegiate academic collaboration for high-level robotics, physics olympiad training, and hackathons.",
    logo_url: "",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Dhaka Regional Science Fair",
    type: "Event Sponsor & Partner",
    website: "",
    description: "Annual co-organizer and festival partner for regional talent hunt competitions and STEM exhibitions.",
    logo_url: "",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Bangladesh Astronomical Association",
    type: "Research & Workshop Partner",
    website: "https://astronomy.org.bd",
    description: "Stargazing camps, telescope building sessions, and deep-space observation workshops.",
    logo_url: "",
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Govt. Science College Alumni Association",
    type: "Endowment Partner",
    website: "",
    description: "Supporting research projects, Falcon rocketry flight trials, and student scholarship grants.",
    logo_url: "",
    is_active: true,
    created_at: new Date().toISOString(),
  },
];
