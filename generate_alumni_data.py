import csv
import json

with open('D:/GSCSC/members.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

members = []
for i, r in enumerate(rows):
    name = r.get("Name", "").strip()
    role = r.get("Executive Panel Post", "").strip()
    photo_url = r.get("Formal Photo", "").strip()
    batch_raw = r.get("HSC Batch(i.e. 1995)", "").strip()
    email = r.get("Email", "").strip()
    phone = r.get("Phone Number", "").strip()
    social = r.get("Social Media Link (i.e. Facebook/Instagram/LinkedIn etc.)", "").strip()
    blood = r.get("Blood Group", "").strip()
    undergrad_field = r.get("Undergraduate Field of Study", "").strip()
    undergrad_inst = r.get("Undergraduate Institution", "").strip()
    undergrad_year = r.get("Undergraduate Completion", "").strip()
    current_job = r.get("Are you doing any jobs currently?", "").strip()
    current_pos = r.get("Current Position", "").strip()
    company = r.get("Do you own any company?\nIf Yes, can you describe something about your company?", "").strip()
    postgrad = r.get("Postgraduate Field of Study", "").strip()
    postgrad_inst = r.get("Postgraduate Institution", "").strip()

    file_id = ""
    if "id=" in photo_url:
        file_id = photo_url.split("id=")[-1].split("&")[0]
    elif "/d/" in photo_url:
        file_id = photo_url.split("/d/")[1].split("/")[0]

    img_link = f"https://lh3.googleusercontent.com/d/{file_id}" if file_id else photo_url

    # Format batch
    batch = batch_raw
    if batch:
        if batch.isdigit():
            if len(batch) == 2:
                batch = f"HSC '{batch}"
            elif len(batch) == 4:
                batch = f"HSC '{batch}"
        elif not batch.startswith("HSC") and not batch.startswith("Batch"):
            batch = f"HSC {batch}"

    # Format undergrad
    undergrad_parts = []
    if undergrad_field:
        undergrad_parts.append(undergrad_field)
    if undergrad_inst:
        undergrad_parts.append(undergrad_inst)
    if undergrad_year and undergrad_year != "N/A":
        undergrad_parts.append(f"({undergrad_year})")
    undergrad = " · ".join(undergrad_parts)

    # Format postgrad
    postgrad_parts = []
    if postgrad:
        postgrad_parts.append(postgrad)
    if postgrad_inst:
        postgrad_parts.append(postgrad_inst)
    postgrad_str = " · ".join(postgrad_parts)

    # Format current career
    career = current_pos
    if not career and current_job.lower() == "yes":
        career = "Professional"
    if company and company != "N/A":
        career = f"{career} ({company})" if career else company

    members.append({
        "id": i + 1,
        "name": name,
        "role": role or "Executive Member",
        "batch": batch or "Alumni",
        "photo": img_link,
        "email": email,
        "phone": phone,
        "social": social if (social.startswith("http") or "linkedin" in social or "facebook" in social) else "",
        "social_text": social if not (social.startswith("http") or "linkedin" in social or "facebook" in social) else "",
        "blood": blood if blood != "N/A" else "",
        "undergrad": undergrad,
        "postgrad": postgrad_str,
        "current_position": career,
        "display_order": i + 1,
    })

ts_content = """export interface AlumniMember {
  id: number;
  name: string;
  role: string;
  batch: string;
  photo: string;
  email?: string;
  phone?: string;
  social?: string;
  social_text?: string;
  blood?: string;
  undergrad?: string;
  postgrad?: string;
  current_position?: string;
  display_order: number;
}

export const ALUMNI_MEMBERS: AlumniMember[] = """ + json.dumps(members, indent=2, ensure_ascii=False) + ";\n"

with open("D:/GSCSC/lib/alumni-data.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Generated D:/GSCSC/lib/alumni-data.ts with {len(members)} members.")
