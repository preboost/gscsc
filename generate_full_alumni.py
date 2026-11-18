import csv
import json

with open('D:/GSCSC/members.csv', mode='r', encoding='utf-8') as f:
    reader = csv.reader(f)
    headers = next(reader)
    rows = list(reader)

members = []
for i, row in enumerate(rows):
    if not row or not any(row):
        continue
    
    timestamp = row[0].strip() if len(row) > 0 else ""
    name = row[1].strip() if len(row) > 1 else ""
    role = row[2].strip() if len(row) > 2 else ""
    photo_raw = row[3].strip() if len(row) > 3 else ""
    batch_raw = row[4].strip() if len(row) > 4 else ""
    email = row[5].strip() if len(row) > 5 else ""
    phone = row[6].strip() if len(row) > 6 else ""
    social = row[7].strip() if len(row) > 7 else ""
    blood = row[8].strip() if len(row) > 8 else ""
    ug_field = row[9].strip() if len(row) > 9 else ""
    ug_inst = row[10].strip() if len(row) > 10 else ""
    ug_year = row[11].strip() if len(row) > 11 else ""
    pg_qual = row[12].strip() if len(row) > 12 else ""
    pg_field = row[13].strip() if len(row) > 13 else ""
    pg_inst = row[14].strip() if len(row) > 14 else ""
    pg_year = row[15].strip() if len(row) > 15 else ""
    other_deg = row[16].strip() if len(row) > 16 else ""
    is_job = row[17].strip() if len(row) > 17 else ""
    cur_pos = row[18].strip() if len(row) > 18 else ""
    company = row[19].strip() if len(row) > 19 else ""

    if not name:
        continue

    # Extract Drive File ID
    file_id = ""
    if "id=" in photo_raw:
        file_id = photo_raw.split("id=")[-1].split("&")[0]
    elif "/d/" in photo_raw:
        file_id = photo_raw.split("/d/")[1].split("/")[0]

    img_link = f"https://lh3.googleusercontent.com/d/{file_id}" if file_id else photo_raw

    # Batch formatting
    batch = batch_raw
    if batch:
        if batch.isdigit():
            batch = f"HSC '{batch}"
        elif not batch.startswith("HSC") and not batch.startswith("Batch"):
            batch = f"HSC '{batch}"

    # Undergrad summary
    ug_parts = [p for p in [ug_field, ug_inst] if p and p.upper() != "N/A"]
    ug_str = " · ".join(ug_parts)
    if ug_year and ug_year.upper() != "N/A":
        ug_str += f" ({ug_year})"

    # Postgrad summary
    pg_parts = [p for p in [pg_qual, pg_field, pg_inst] if p and p.upper() != "N/A"]
    pg_str = " · ".join(pg_parts)
    if pg_year and pg_year.upper() != "N/A":
        pg_str += f" ({pg_year})"

    # Clean social link
    social_url = ""
    social_handle = ""
    if social and social.upper() != "N/A" and social.lower() != "not interested" and social.lower() != "na":
        if social.startswith("http") or "linkedin.com" in social or "facebook.com" in social:
            social_url = social if social.startswith("http") else f"https://{social}"
        else:
            social_handle = social

    # Clean phone
    clean_phone = phone.replace(" ", "").replace("-", "") if phone and phone.upper() != "N/A" else ""

    # Clean email
    clean_email = email if email and "@" in email else ""

    # Clean career
    career = cur_pos if cur_pos and cur_pos.upper() != "N/A" else ""
    if company and company.upper() != "N/A" and len(company.strip()) > 1:
        clean_company = company.strip().replace("\n", " ")
        if career:
            career = f"{career} at {clean_company}"
        else:
            career = clean_company
    elif is_job.lower() == "yes" and not career:
        career = "Employed"

    members.append({
        "id": i + 1,
        "name": name,
        "role": role or "Executive Member",
        "batch": batch or "Alumni",
        "photo": img_link,
        "email": clean_email,
        "phone": clean_phone,
        "blood": blood if blood and blood.upper() != "N/A" else "",
        "undergrad": ug_str,
        "postgrad": pg_str,
        "other_degrees": other_deg if other_deg and other_deg.upper() != "N/A" else "",
        "current_position": career,
        "social_url": social_url,
        "social_handle": social_handle,
        "display_order": i + 1,
    })

print(f"Total parsed members: {len(members)}")

ts_output = """export interface AlumniMember {
  id: number;
  name: string;
  role: string;
  batch: string;
  photo: string;
  email?: string;
  phone?: string;
  blood?: string;
  undergrad?: string;
  postgrad?: string;
  other_degrees?: string;
  current_position?: string;
  social_url?: string;
  social_handle?: string;
  display_order: number;
}

export const ALUMNI_MEMBERS: AlumniMember[] = """ + json.dumps(members, indent=2, ensure_ascii=False) + ";\n"

with open("D:/GSCSC/lib/alumni-data.ts", "w", encoding="utf-8") as f:
    f.write(ts_output)

print("Saved to D:/GSCSC/lib/alumni-data.ts successfully.")
