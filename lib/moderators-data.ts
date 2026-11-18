export interface Moderator {
  id: number;
  name: string;
  designation: string;
  department: string;
  tag: string;
  bio: string;
  photo?: string;
  phone?: string;
  email?: string;
  display_order: number;
}

export const DEFAULT_MODERATORS: Moderator[] = [
  {
    id: 1,
    name: "Prof. Md. Abdul Jalil",
    designation: "Chief Patron & Principal",
    department: "Govt. Science College, Dhaka",
    tag: "College Principal & Patron",
    bio: "Distinguished academic leader patronizing GSCSC's scientific initiatives, national festivals, and aerospace innovation since college inception.",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    email: "principal@gsc.edu.bd",
    phone: "01711000001",
    display_order: 1,
  },
  {
    id: 2,
    name: "Dr. Nazmul Huda",
    designation: "Chief Moderator & Associate Professor",
    department: "Department of Physics",
    tag: "Physics & Research Advisor",
    bio: "Senior faculty mentor leading Olympiad coaching bootcamps, experimental rocketry, and scientific project vetting for national competitions.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    email: "nazmul.physics@gsc.edu.bd",
    phone: "01711000002",
    display_order: 2,
  },
  {
    id: 3,
    name: "Mrs. Shahnaz Parveen",
    designation: "Co-Moderator & Assistant Professor",
    department: "Department of Chemistry",
    tag: "Chemistry & Operations Advisor",
    bio: "Dedicated faculty mentor overseeing club administration, member welfare, research ethics, and publication standards across all 10 specialized wings.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    email: "shahnaz.chem@gsc.edu.bd",
    phone: "01711000003",
    display_order: 3,
  },
  {
    id: 4,
    name: "Mohammad Zahidul Islam",
    designation: "Faculty Advisor & Senior Lecturer",
    department: "Department of Mathematics",
    tag: "Mathematics & Olympiad Lead",
    bio: "Mentoring competitive Olympiad contestants, mathematical simulation for sounding rocket aerodynamics, and statistical research methods.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
    email: "zahidul.math@gsc.edu.bd",
    phone: "01711000004",
    display_order: 4,
  },
  {
    id: 5,
    name: "Dr. Farhana Yasmin",
    designation: "Faculty Advisor & Assistant Professor",
    department: "Department of Biology & Botany",
    tag: "Life Sciences & Bio-Tech",
    bio: "Guiding biotechnology research, eco-science projects, laboratory instrumentation, and international biology Olympiad preparation.",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800",
    email: "farhana.bio@gsc.edu.bd",
    phone: "01711000005",
    display_order: 5,
  },
];
