import json
import re

def escape_sql(val):
    if val is None:
        return "NULL"
    val_str = str(val)
    val_str = val_str.replace("'", "''")
    return f"'{val_str}'"

# 1. Read Alumni data from lib/alumni-data.ts
with open(r"D:\GSCSC\lib\alumni-data.ts", "r", encoding="utf-8") as f:
    alumni_content = f.read()

# Extract json array from ALUMNI_MEMBERS
m = re.search(r"export const ALUMNI_MEMBERS: AlumniMember\[\] = (\[.*?\]);", alumni_content, re.DOTALL)
if m:
    alumni_data = json.loads(m.group(1))
else:
    alumni_data = []

# 2. Executives data
executives_data = [
  { "id": 1, "name": "Arif Hossain", "role": "President", "department": "Central Executive Committee", "session": "Batch '24", "photo": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800", "phone": "01712000010", "email": "president.gscsc@gmail.com", "blood": "B+", "bio": "Chief executive leading club governance, national festival planning, and collegiate research partnerships.", "display_order": 1 },
  { "id": 2, "name": "Nusrat Jahan", "role": "General Secretary", "department": "Administration Wing", "session": "Batch '24", "photo": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800", "phone": "01712000011", "email": "gs.gscsc@gmail.com", "blood": "A+", "bio": "Managing overall club administrative workflow, inter-wing coordination, and member relations.", "display_order": 2 },
  { "id": 3, "name": "Rafid Karim", "role": "Treasurer", "department": "Finance & Accounts Wing", "session": "Batch '24", "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800", "phone": "01712000012", "email": "treasurer.gscsc@gmail.com", "blood": "O+", "bio": "Supervising club financial audits, budget allocations for rocketry tests, and sponsor grants.", "display_order": 3 },
  { "id": 4, "name": "Lamia Islam", "role": "Joint Secretary (Admin)", "department": "Internal Operations", "session": "Batch '24", "photo": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800", "phone": "01712000013", "email": "js.admin.gscsc@gmail.com", "blood": "AB+", "bio": "Coordinating internal departmental operations and general executive training bootcamps.", "display_order": 4 },
  { "id": 5, "name": "Kazi Al-Amin", "role": "Joint Secretary (Events)", "department": "Festival Affairs & Logistics", "session": "Batch '24", "photo": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=800", "phone": "01712000014", "email": "js.events.gscsc@gmail.com", "blood": "B+", "bio": "Lead logistical planner for the annual National Science & Technology Festival.", "display_order": 5 },
  { "id": 6, "name": "Shahriar Nafis", "role": "Head of IT & Automation", "department": "IT & Software Wing", "session": "Batch '24", "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800", "phone": "01712000015", "email": "it.head.gscsc@gmail.com", "blood": "O+", "bio": "Lead developer managing cloud servers, automated registration systems, and digital portals.", "display_order": 6 },
  { "id": 7, "name": "Tanvir Ahmed", "role": "Head of Rocketry & Robotics", "department": "Engineering Division (GSC Falcon)", "session": "Batch '24", "photo": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800", "phone": "01712000016", "email": "falcon.head.gscsc@gmail.com", "blood": "A+", "bio": "Lead avionics & propulsion engineer for Project Orbitfall and sounding rocket flight tests.", "display_order": 7 },
  { "id": 8, "name": "Farida Haque", "role": "Head of Press & Media", "department": "Publications & Visual Media", "session": "Batch '24", "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800", "phone": "01712000017", "email": "media.gscsc@gmail.com", "blood": "B+", "bio": "Chief editorial designer for annual club magazine, research digests, and photo coverage.", "display_order": 8 },
  { "id": 9, "name": "Mehedi Hasan", "role": "Head of Olympiad Circuit", "department": "Academic Wings & Training", "session": "Batch '24", "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800", "phone": "01712000018", "email": "olympiad.gscsc@gmail.com", "blood": "AB-", "bio": "Head coach for national math, physics, informatics, and astrophysics Olympiad squads.", "display_order": 9 }
]

# 3. Moderators data
moderators_data = [
  { "id": 1, "name": "Prof. Md. Abdul Jalil", "designation": "Chief Patron & Principal", "department": "Govt. Science College, Dhaka", "tag": "College Principal & Patron", "bio": "Distinguished academic leader patronizing GSCSC's scientific initiatives, national festivals, and aerospace innovation since college inception.", "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800", "email": "principal@gsc.edu.bd", "phone": "01711000001", "display_order": 1 },
  { "id": 2, "name": "Dr. Nazmul Huda", "designation": "Chief Moderator & Associate Professor", "department": "Department of Physics", "tag": "Physics & Research Advisor", "bio": "Senior faculty mentor leading Olympiad coaching bootcamps, experimental rocketry, and scientific project vetting for national competitions.", "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800", "email": "nazmul.physics@gsc.edu.bd", "phone": "01711000002", "display_order": 2 },
  { "id": 3, "name": "Mrs. Shahnaz Parveen", "designation": "Co-Moderator & Assistant Professor", "department": "Department of Chemistry", "tag": "Chemistry & Operations Advisor", "bio": "Dedicated faculty mentor overseeing club administration, member welfare, research ethics, and publication standards across all 10 specialized wings.", "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800", "email": "shahnaz.chem@gsc.edu.bd", "phone": "01711000003", "display_order": 3 },
  { "id": 4, "name": "Mohammad Zahidul Islam", "designation": "Faculty Advisor & Senior Lecturer", "department": "Department of Mathematics", "tag": "Mathematics & Olympiad Lead", "bio": "Mentoring competitive Olympiad contestants, mathematical simulation for sounding rocket aerodynamics, and statistical research methods.", "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800", "email": "zahidul.math@gsc.edu.bd", "phone": "01711000004", "display_order": 4 },
  { "id": 5, "name": "Dr. Farhana Yasmin", "designation": "Faculty Advisor & Assistant Professor", "department": "Department of Biology & Botany", "tag": "Life Sciences & Bio-Tech", "bio": "Guiding biotechnology research, eco-science projects, laboratory instrumentation, and international biology Olympiad preparation.", "photo": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800", "email": "farhana.bio@gsc.edu.bd", "phone": "01711000005", "display_order": 5 }
]

# 4. Events data
events_data = [
  { "id": 1, "title": "12th National Science & Tech Carnival 2025", "description": "Flagship 3-day nationwide festival with Olympiad circuits, project display, drone racing, and astrophysics summits.", "date": "November 20-22, 2025", "location": "Govt. Science College Campus, Tejgaon", "category": "National Carnival", "registration_link": "https://forms.gle/gscsc-carnival-2025", "is_active": True, "is_upcoming": True },
  { "id": 2, "title": "GSC Falcon Sounding Rocket Workshop & Static Test", "description": "Hands-on model rocketry simulation, solid motor ignition safety protocols, and live payload data acquisition workshop.", "date": "April 05, 2025", "location": "Aerospace Lab & College Field", "category": "Rocketry Workshop", "registration_link": "https://forms.gle/falcon-workshop-2025", "is_active": True, "is_upcoming": True },
  { "id": 3, "title": "11th National Science & Tech Festival", "description": "Over 3,500 delegates from 120+ institutions across Bangladesh competed in model making, science quiz, and Olympiad circuits.", "date": "December 2023", "location": "Govt. Science College, Dhaka", "category": "National Festival", "is_active": True, "is_upcoming": False }
]

# 5. Partners data
partners_data = [
  { "id": 1, "name": "Bangladesh Science Society (BSS)", "type": "Academic Partner", "website": "https://bss.org.bd", "description": "National science promotion body collaborating on countrywide science fairs and olympiad mentoring.", "is_active": True },
  { "id": 2, "name": "BUET Science Club", "type": "Club Partner", "website": "https://buet.ac.bd", "description": "Inter-collegiate academic collaboration for high-level robotics, physics olympiad training, and hackathons.", "is_active": True },
  { "id": 3, "name": "Dhaka Regional Science Fair", "type": "Event Sponsor & Partner", "website": "", "description": "Annual co-organizer and festival partner for regional talent hunt competitions and STEM exhibitions.", "is_active": True },
  { "id": 4, "name": "Bangladesh Astronomical Association", "type": "Research & Workshop Partner", "website": "https://astronomy.org.bd", "description": "Stargazing camps, telescope building sessions, and deep-space observation workshops.", "is_active": True },
  { "id": 5, "name": "Govt. Science College Alumni Association", "type": "Endowment Partner", "website": "", "description": "Supporting research projects, Falcon rocketry flight trials, and student scholarship grants.", "is_active": True }
]

# Generate SQL script
sql = []
sql.append("-- ============================================================================")
sql.append("-- GOVT. SCIENCE COLLEGE SCIENCE CLUB (GSCSC) - MASTER DATABASE SCHEMA & DUMP")
sql.append("-- Compatible with PostgreSQL, SQLite, MySQL, Supabase & Cloudflare D1")
sql.append("-- Generated: 2026-11-17")
sql.append("-- ============================================================================\n")

sql.append("-- 1. ALUMNI & FORMER PANELS TABLE")
sql.append("""CREATE TABLE IF NOT EXISTS alumni_members (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    batch VARCHAR(100),
    photo TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    blood VARCHAR(10),
    undergrad TEXT,
    postgrad TEXT,
    other_degrees TEXT,
    current_position TEXT,
    social_url TEXT,
    social_handle VARCHAR(100),
    display_order INT DEFAULT 99,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);""")

for a in alumni_data:
    cols = ["id", "name", "role", "batch", "photo", "email", "phone", "blood", "undergrad", "postgrad", "other_degrees", "current_position", "social_url", "display_order"]
    vals = [str(a.get("id")), escape_sql(a.get("name")), escape_sql(a.get("role")), escape_sql(a.get("batch")), escape_sql(a.get("photo")), escape_sql(a.get("email")), escape_sql(a.get("phone")), escape_sql(a.get("blood")), escape_sql(a.get("undergrad")), escape_sql(a.get("postgrad")), escape_sql(a.get("other_degrees")), escape_sql(a.get("current_position")), escape_sql(a.get("social_url")), str(a.get("display_order", 99))]
    sql.append(f"INSERT INTO alumni_members ({', '.join(cols)}) VALUES ({', '.join(vals)});")

sql.append("\n-- 2. EXECUTIVE COMMITTEE TABLE")
sql.append("""CREATE TABLE IF NOT EXISTS executive_members (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    session VARCHAR(100),
    photo TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    blood VARCHAR(10),
    bio TEXT,
    display_order INT DEFAULT 99,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);""")

for e in executives_data:
    cols = ["id", "name", "role", "department", "session", "photo", "phone", "email", "blood", "bio", "display_order"]
    vals = [str(e.get("id")), escape_sql(e.get("name")), escape_sql(e.get("role")), escape_sql(e.get("department")), escape_sql(e.get("session")), escape_sql(e.get("photo")), escape_sql(e.get("phone")), escape_sql(e.get("email")), escape_sql(e.get("blood")), escape_sql(e.get("bio")), str(e.get("display_order", 99))]
    sql.append(f"INSERT INTO executive_members ({', '.join(cols)}) VALUES ({', '.join(vals)});")

sql.append("\n-- 3. CLUB MODERATORS TABLE")
sql.append("""CREATE TABLE IF NOT EXISTS club_moderators (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    tag VARCHAR(255),
    bio TEXT,
    photo TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    display_order INT DEFAULT 99,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);""")

for m in moderators_data:
    cols = ["id", "name", "designation", "department", "tag", "bio", "photo", "phone", "email", "display_order"]
    vals = [str(m.get("id")), escape_sql(m.get("name")), escape_sql(m.get("designation")), escape_sql(m.get("department")), escape_sql(m.get("tag")), escape_sql(m.get("bio")), escape_sql(m.get("photo")), escape_sql(m.get("phone")), escape_sql(m.get("email")), str(m.get("display_order", 99))]
    sql.append(f"INSERT INTO club_moderators ({', '.join(cols)}) VALUES ({', '.join(vals)});")

sql.append("\n-- 4. EVENTS & FESTIVALS TABLE")
sql.append("""CREATE TABLE IF NOT EXISTS events_festivals (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date VARCHAR(100),
    location VARCHAR(255),
    category VARCHAR(100),
    image_url TEXT,
    registration_link TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_upcoming BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);""")

for ev in events_data:
    cols = ["id", "title", "description", "date", "location", "category", "registration_link", "is_active", "is_upcoming"]
    vals = [str(ev.get("id")), escape_sql(ev.get("title")), escape_sql(ev.get("description")), escape_sql(ev.get("date")), escape_sql(ev.get("location")), escape_sql(ev.get("category")), escape_sql(ev.get("registration_link")), "TRUE" if ev.get("is_active") else "FALSE", "TRUE" if ev.get("is_upcoming") else "FALSE"]
    sql.append(f"INSERT INTO events_festivals ({', '.join(cols)}) VALUES ({', '.join(vals)});")

sql.append("\n-- 5. CLUB PARTNERS TABLE")
sql.append("""CREATE TABLE IF NOT EXISTS club_partners (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    website TEXT,
    description TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);""")

for p in partners_data:
    cols = ["id", "name", "type", "website", "description", "is_active"]
    vals = [str(p.get("id")), escape_sql(p.get("name")), escape_sql(p.get("type")), escape_sql(p.get("website")), escape_sql(p.get("description")), "TRUE" if p.get("is_active") else "FALSE"]
    sql.append(f"INSERT INTO club_partners ({', '.join(cols)}) VALUES ({', '.join(vals)});")

sql.append("\n-- 6. JOIN REQUESTS TABLE")
sql.append("""CREATE TABLE IF NOT EXISTS join_requests (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    college_roll VARCHAR(50),
    session VARCHAR(50),
    department VARCHAR(255),
    interest TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);""")

sql.append("\n-- 7. CONTACT MESSAGES TABLE")
sql.append("""CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);""")

sql.append("\n-- 8. ADMIN & STAFF USERS TABLE")
sql.append("""CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO admin_users (username, password_hash, name, role) VALUES ('jim', 'jim1234', 'Jim', 'administrator');
INSERT INTO admin_users (username, password_hash, name, role) VALUES ('gscscstuff', '@gscscstuff1981', 'GSCSC Staff', 'staff');
""")

with open(r"D:\GSCSC\database\schema.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql))

print(f"Generated master schema with {len(alumni_data)} alumni, {len(executives_data)} executives, {len(moderators_data)} moderators!")
