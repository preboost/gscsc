import csv
import json

with open('D:/GSCSC/members.csv', mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

print(f"Total rows: {len(rows)}")

members = []
for i, r in enumerate(rows):
    name = r.get("Name", "").strip()
    role = r.get("Executive Panel Post", "").strip()
    photo_url = r.get("Formal Photo", "").strip()
    batch = r.get("HSC Batch(i.e. 1995)", "").strip()
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

    # Convert Google Drive view URL to direct thumbnail / viewable link if applicable
    # e.g. https://drive.google.com/open?id=1bqBIHiE5HPZpdGNfrl-pBQsct6oMWLhT -> https://lh3.googleusercontent.com/d/1bqBIHiE5HPZpdGNfrl-pBQsct6oMWLhT
    file_id = ""
    if "id=" in photo_url:
        file_id = photo_url.split("id=")[-1].split("&")[0]
    elif "/d/" in photo_url:
        file_id = photo_url.split("/d/")[1].split("/")[0]

    img_link = f"https://lh3.googleusercontent.com/d/{file_id}" if file_id else photo_url

    members.append({
        "id": i + 1,
        "name": name,
        "role": role,
        "batch": f"HSC '{batch}" if batch and not batch.startswith("HSC") and not batch.startswith("Batch") else batch,
        "photo": img_link,
        "drive_photo": photo_url,
        "file_id": file_id,
        "email": email,
        "phone": phone,
        "social": social,
        "blood": blood,
        "undergrad": f"{undergrad_field}, {undergrad_inst}" if undergrad_field and undergrad_inst else (undergrad_inst or undergrad_field),
        "postgrad": f"{postgrad}, {postgrad_inst}" if postgrad and postgrad_inst else (postgrad or postgrad_inst),
        "current_position": current_pos or ("Employed" if current_job.lower() == "yes" else ""),
        "company": company,
    })

print(f"Parsed {len(members)} members successfully.")
with open('D:/GSCSC/parsed_members.json', 'w', encoding='utf-8') as out_f:
    json.dump(members, out_f, indent=2, ensure_ascii=False)

for m in members[:10]:
    print(f"- {m['name']} | Role: {m['role']} | Batch: {m['batch']} | Undergrad: {m['undergrad']}")
