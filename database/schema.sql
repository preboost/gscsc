-- ============================================================================
-- GOVT. SCIENCE COLLEGE SCIENCE CLUB (GSCSC) - MASTER DATABASE SCHEMA & DUMP
-- Compatible with PostgreSQL, SQLite, MySQL, Supabase & Cloudflare D1
-- Generated: 2026-11-17
-- ============================================================================

-- 1. ALUMNI & FORMER PANELS TABLE
CREATE TABLE IF NOT EXISTS alumni_members (
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
);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (1, 'DR. SUMIT SAHA', 'GENERAL SECRETARY', 'HSC ''2013', 'https://lh3.googleusercontent.com/d/1gKrTljuA14aGjQ9AQ3iDCIMHvQlFohYx', 'dr.sumitsaha.pmc@gmail.com', '01511444156', 'O+', 'MBBS · POPULAR MEDICAL COLLEGE (2019)', 'CCD · DIABETIS · BIRDEM (2025)', 'CCVD', 'SENIOR MEDICAL OFFICER at MONOWARA HOSPITAL', '', 1);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (2, 'Farhan Sadik Kawsar', 'Vice president of photography and media', 'HSC ''2022', 'https://lh3.googleusercontent.com/d/1bqBIHiE5HPZpdGNfrl-pBQsct6oMWLhT', 'xarhan62@gmail.com', '01647520207', 'A+', 'BSC in CSE · Daffodil international university (2027)', '', '', '', 'https://www.linkedin.com/in/farhan-sadik-kawsar462/', 2);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (3, 'Mehedi Hasan', 'Vice president of administration', 'HSC ''22', 'https://lh3.googleusercontent.com/d/14T74HDDmOWjP1fK1kTBRA0FobMuUnvwf', 'Supremebanks01@gmail.com', '01639771486', 'O-', 'Energy System Engineering · Deggendorf Uni of Technology Munich, Germany (Running)', '', '', 'Employed', '', 3);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (4, 'Sumit Saha', 'General Secretary', 'HSC ''2023', 'https://lh3.googleusercontent.com/d/1_EqP7HJk9S2tSmPDEQgRQ5XdJ0ENpKL4', 'sumitsahapir@gmail.com', '01400700346', 'A+', 'B. Sc. in CSE · Daffodil International University (2029)', '', '', '', 'https://www.facebook.com/share/185HPt5SrE/', 4);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (5, 'Md Rizwan Mahdi Rafi', 'AGS', 'HSC ''2022', 'https://lh3.googleusercontent.com/d/1zN99yPAcj0n-20X3ILwT3CtIM9je9O4I', 'mdrizwanmahdi@gmail.com', '01887371284', 'A+', 'Pharmacy · Jashore University of Science and Technology', '', '', '', 'https://www.facebook.com/share/1AXHpDYrP7/?mibextid=wwXIfr', 5);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (6, 'Tonmoy Karmakar Sagor', 'Secretary of Logistics', 'HSC ''2022', 'https://lh3.googleusercontent.com/d/1WtY5fO3jWgh9YIu5sDuuuksERdETQMHk', 'tonmoykarmakarsagor@gmail.com', '01851610477', 'AB+', 'Statistics · Shahjalal University of Science and Technology, Sylhet (2027)', '', '', '', 'https://www.facebook.com/share/1DSfa5SPdb/', 6);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (7, 'Ashraful Islam Tanzil', 'VP of Public Relation', 'HSC ''2020', 'https://lh3.googleusercontent.com/d/1LJgZHgCQgLHmWWKPi6BDWjL-SnnFAueF', 'ahmedtanzil174@gmail.com', '01837859130', 'O+', 'CSE · United International University (2026)', '', '', '', 'https://www.linkedin.com/in/ai-tanzil?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', 7);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (8, 'B.M Shahid Mahmud', 'Joint Secretary of Administration', 'HSC ''2021', 'https://lh3.googleusercontent.com/d/1y8kRHNe6M_uleUPtzW0izzYBU0005KBB', 'sha06hid49@gmail.com', '01865949594', 'B+', 'B.Sc in Textile Engineering · Mawlana Bhashani Science & Technology University (2027)', '', '', '', 'https://www.facebook.com/share/1ZhXuTy274/', 8);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (9, 'Saraf Abdullah', 'VP of Quizzing Affairs', 'HSC ''2020', 'https://lh3.googleusercontent.com/d/19PwkOWmiPJUxnGAAzQN-8pPViGvNjWZG', 'saraf.abdullah2502@gmail.com', '01629670185', 'A+', 'History · University of Dhaka (Yes)', 'Masters · International History · University of Dhaka', '', 'Student', 'https://www.facebook.com/share/1HBE1QhCvE/', 9);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (10, 'Sadhin Howlader', 'Club officer', 'HSC ''2020', 'https://lh3.googleusercontent.com/d/1GoFdniFJuWgzAjzmGm0TOmH2elrHnTuY', 'sadhinhowladher182@gmail.com', '01759302444', 'AB+', 'BSc in Textile Engineering · Ahsanullah University of Science and Technology (2026)', '', '', 'Student at No', 'https://www.facebook.com/share/1CRCbXm7wG/', 10);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (11, 'Dr Sumit Saha', 'General Secretary', 'HSC ''2013', 'https://lh3.googleusercontent.com/d/1ps1QEtgoy1xbIiVHJ4q2UBeYowfqi_Rt', 'dr.sumitsaha.pmc@gmail.com', '01511444156', 'O+', 'MBBS · Popular Medical College (2020)', 'CCD,CCVD,CMU,PGT · ORTHOPEDICS · ICRI,DLP (2025)', '', 'Senior Medical Officer', '', 11);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (12, 'H M Atikur Rahaman Masum', 'ViceVice-President Of Information & Technology', 'HSC ''2022', 'https://lh3.googleusercontent.com/d/1b0wmWvRxs90TtbV5n7N330aPkCRkXluh', 'atikur8611@gmail.com', '01560004313', 'O+', 'Bacholar of Laws · Bangladesh Army International University of Science & Technology (Expected 2028)', '', '', '', 'https://www.facebook.com/share/1ZfFub9GUF/?mibextid=wwXIfr', 12);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (13, 'Mahmud Khan Alif', 'Club Officer', 'HSC ''2021', 'https://lh3.googleusercontent.com/d/1afMd--wNLfa_FX_nWRXK_xXbUCIYeMtz', 'mahmudkhanalif@yahoo.com', '01316702727', 'A+', 'CSE · Southeast University (2027)', '', '', '', 'https://www.facebook.com/mahmudkhanalif', 13);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (14, 'Momman Ahmed', 'GENERAL SECRETARY', 'HSC ''2019', 'https://lh3.googleusercontent.com/d/1OMe1VFLPWRPuDjkK4K_u9ETW1pQNye_a', 'ahmedmomman604@gmail.com', '01534553931', 'O+', 'Audiology & speech language pathology · PISER - BUP (First class)', '', '', 'Professional Audiologist', '', 14);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (15, 'Md Jabir Abdullah', 'JS (PR)', 'HSC ''2020', 'https://lh3.googleusercontent.com/d/1CbFWekiaNC2FPtA9mD_g7lj_s3cMHcfE', 'abdullahjabir5805@gmail.com', '01910575805', 'AB+', 'MBBS · Dhaka Community Medical College (Not yet)', '', '', '', 'https://facebook.com/alorultabati', 15);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (16, 'Tanjinul Hoque Taha', 'Secretary of Press and Publication', 'HSC ''2022', 'https://lh3.googleusercontent.com/d/1y53FJQUbd5AMO0BJMxTeDlbszbBqnp9r', 'tanjinulhoquetaha@gmail.com', '01810202261', 'AB+', 'B.Sc. in Agriculture with (Hons.) · Patuakhali Science And Technology University (Expected Completion -2027)', '', '', '', 'https://www.facebook.com/share/1GpUSBquHH/', 16);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (17, 'Mohammad Tanvir Hasan', 'Organising Secretary and Joint secretary of Project display', 'HSC ''2022', 'https://lh3.googleusercontent.com/d/1K2GXJCmbhqZJR2tvfAeUPpQmMkdm7nRD', 'tanvir.tonoy22@gmail.com', '01790941258', 'B+', 'Physics · University of Chittagong (Expected 2028)', '', '', '', 'https://www.facebook.com/share/1FmUqzXBg9/', 17);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (18, 'Shamsul Arefin Zim', 'President', 'HSC ''2024', 'https://lh3.googleusercontent.com/d/1CpIIlBuwbY6lXrDpHAdlxG1FWbYNSlBs', 'arefinzim8@gmail.com', '01631186974', 'O+', 'BBA · North south university (First year)', '', '', '', 'https://www.facebook.com/share/1G4TmVcTaU/', 18);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (19, 'MD. RAHAT TALUKDER', 'President', 'HSC ''2021', 'https://lh3.googleusercontent.com/d/1P98BU_I9PjxqyqGONCfddKNOUgxX13KW', 'rahattalukder05@gmail.com', '01521733959', 'A+', 'COMPUTER SCIENCE · University of Liberal Arts Bangladesh (2026)', 'NA · NA · NA (NA)', 'NA', 'Design Technologist at NA', 'https://www.linkedin.com/in/rahattalukder', 19);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (20, 'MD ASIF HOSSAIN (RATIN)', 'Vice President of Quizzing Affairs', 'HSC ''2019', 'https://lh3.googleusercontent.com/d/1ulwi4aDAfAtwwV-462u0CdiF4b6Pfe1H', 'asifratin2001@gmail.com', '01782163042', 'O+', 'Health Economics · University of Dhaka (BSS Hons.)', 'MSS · Health Economics · University of Dhaka (Ongoing)', '', '', 'https://www.facebook.com/share/17XoEvAX91/', 20);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (21, 'Md. Sakib Hossain', 'President', 'HSC ''2020', 'https://lh3.googleusercontent.com/d/1RgHtAsF6DTv9NNferrnNcF4rm2fxeWCl', 'hmdsakib942@gmail.com', '01753397309', 'A+', 'Computer Science Engineering · United International University (2026)', '', '', '', 'https://www.facebook.com/share/1CpcrU4gzL/?mibextid=wwXIfr', 21);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (22, 'Md. Sultanur Kobir', 'Vice President of Press and Publications', 'HSC ''2019', 'https://lh3.googleusercontent.com/d/1iPj2mSNq7HzgES2YfYFrMsth7JEe_gnF', 'kobir00042@gmail.com', '01521558883', 'O+', 'Electrical and Electronic Engineering · Ahsanullah University of Science and Technology (2025)', '', '', 'Engineer', 'https://www.facebook.com/skobir2.0', 22);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (23, 'Yasir Hasan Tushi', 'Incharge of Food and beverage', 'HSC ''2018', 'https://lh3.googleusercontent.com/d/1_CT-8tm6u4ujGJMPp_sxI4UCdqIkAz3-', 'ayeaaseer@gmail.com', '01521572291', 'B+', 'Bangla · University of Chittagong (2025)', 'MA · Bangla · University of Chittagong (2026)', '', '', 'https://www.facebook.com/Yeaaseer', 23);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (24, 'Golam Akib Chowdhury', 'In-Charge of Volunteer', 'HSC ''2023', 'https://lh3.googleusercontent.com/d/1XsN2MdgEb13roNghW0LrXGGistxtNsfM', 'chowdhurygolamakib113@gmail.com', '01711744391', 'B+', 'BBA · Presidency University (2028)', '', 'ACCA', '', 'https://www.facebook.com/share/1ChzuXeRTX/', 24);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (25, 'Muktadir Morshed', 'Incharge of Volunteer', 'HSC ''2024', 'https://lh3.googleusercontent.com/d/17y4me7KaLDzOpf9SLTQCXtun8gDkDWE7', 'sazidjr11@gmail.com', '01607648817', 'B+', 'Cse · Nsu (2029)', '', '', '', 'https://www.facebook.com/share/1QygaQR71G/', 25);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (26, 'Hridoy Saha', 'Vice President (Olympiad)', 'HSC ''2018', 'https://lh3.googleusercontent.com/d/15Qo6LDnOGz7OqQVgAlrA5YlKPNqCv8xF', 'hsaha1004@gmail.com', '01751064570', 'O+', 'Bachelor of Pharmacy (B.Pharm) · University of Asia Pacific - UAP (January, 2025)', 'Enrolled · M.Pharm in Pharmaceutical Technology · University of Asia Pacific - UAP (Enrolled)', 'No', 'No', 'https://LinkedIn : https://www.linkedin.com/in/hridoy-saha-74350a280

Facebook : https://www.facebook.com/share/1Hvc6gjPWU/', 26);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (27, 'Md. Rashedul Islam', 'Vice president of Wall Magazine', 'HSC ''2022', 'https://lh3.googleusercontent.com/d/1TV_D-BOIjBxWPWj-nLhRhYxj4MqiDBEq', 'ri998188@gmail.com', '+8801610275588', 'A+', 'Botany · National University (2026)', '', '', '', 'https://www.facebook.com/Rashed4422', 27);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (28, 'Javed Hossain', 'Assistant General Secretary', 'HSC ''2021', 'https://lh3.googleusercontent.com/d/1GQ22uzH_Ut8hRlmtrs17fLhfhQflj6c9', 'javedhossain340@gmail.com', '01300528068', 'B-', 'Computer Science and Engineering · University of Information Technology and Sciences (Final year)', '', '', '', 'https://www.facebook.com/share/1K9GycidfF/', 28);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (29, 'Md. Arnob Hassan Ayon', 'Vice President Of Quizzing Affairs', 'HSC ''2023', 'https://lh3.googleusercontent.com/d/1JiddB-MWdgQEWvxycXLL7DN860GbKxfg', 'arnobhassanayon@gmail.com', '01572905394', 'A+', 'Civil Engineering · University Of Asia Pacific (2028)', '', '', '', 'https://www.facebook.com/arnobhassan.ayon.5', 29);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (30, 'Muntasirul Hoque', 'Secretary of Gaming & Affairs', 'HSC ''2022', 'https://lh3.googleusercontent.com/d/1JajAjI4F60355kPbUMABYrAI4ZuFEJQC', 'muntasirulhoque7@gmail.com', '01791471601', 'B+', 'Computer Science & Engineering · American International University-Bangladesh (3rd Year 2nd Semester)', '', '', '', 'https://www.facebook.com/muntasirul712', 30);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (31, 'Md. Iaj Uddin Ahmed', 'Vice President of Quizzing Affairs', 'HSC ''2022', 'https://lh3.googleusercontent.com/d/1E4pFtLXNlee4FGXxt09IOq9BxUfsBUFN', 'miuas789@gmail.com', '01533901105', 'O+', 'Institute of Health Economics (Bachelor of Social Science) · University of Dhaka (2027)', '', '', '', 'https://www.facebook.com/share/1BwkgmEege/', 31);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (32, 'K.M Faysal', 'Vice President of Administration', 'HSC ''2018', 'https://lh3.googleusercontent.com/d/1PDjrf4DPv34FAKzfB2AMDIJDMvgWrb-h', 'k.mfaysal8499@gmail.com', '01631366118', 'A+', 'Computer Science and Engineering · Projukti Unit By University of Dhaka (2024)', '', '', 'Employed', 'https://www.facebook.com/share/1AezTpGdTK/?mibextid=wwXIfr', 32);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (33, 'Md. Zarif Latif', 'Vice President of Administration', 'HSC ''2021', 'https://lh3.googleusercontent.com/d/1H1I37TZEgi6jIjyY7wOaTunfarviNlkY', 'zarif.latif.biz@gmail.com', '01308035203', 'O+', 'Computer Science · BRAC University (2026)', '', '', 'Intern at Bangladesh Computer Council, ICT MINISTRY', 'https://www.facebook.com/share/1AmX39uLmh/', 33);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (34, 'Iktiar Ahmed Tashdid', 'VP', 'HSC ''2018', 'https://lh3.googleusercontent.com/d/1UXkV7TgIAJ3YfwAESswykC3ty2ZEOWSI', 'iktearahmedtashdid01@gmail.com', '+8801792202558', 'B+', 'Environmental Science · Bangladesh University of Professionals (B.Sc completed)', 'M.Sc in Environmental Science · Environmental Science · Bangladesh University of Professionals (Yes)', 'Millennium Fellow (1st Bangladeshi cohort)', 'Project Analyst', 'https://www.facebook.com/iktearahmed.tashdid', 34);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (35, 'Najmul Bari', 'Club Officer', 'HSC ''2018', 'https://lh3.googleusercontent.com/d/1emUuXYKTC3jhOjT2o0uRLNxfvXytMSSn', 'najmul.bari107@gmail.com', '01992012990', 'O+', 'Mechanical Engineering · Islamic University of Technology (2023)', '', '', 'Business Development Executive', 'https://linkedin.com/in/najmul-bari', 35);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (36, 'Arefin Faisal', 'in charge of volunteers', 'HSC ''2018', 'https://lh3.googleusercontent.com/d/1W0LF3t76g1e9ZSt1JrUxQDO3QXX1G5eE', 'faisalhossain685@gmail.com', '197,503,604,701,625,000,000', 'A+', 'CSE · Dhaka City College (2023)', 'no', '', 'CEO', 'https://www.facebook.com/share/1AYk2fkVzm/?mibextid=wwXIfr', 36);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (37, 'Tonmoy Hassan Tomal', 'VP IT', 'HSC ''2019', 'https://lh3.googleusercontent.com/d/1VDPgag9buwTVvZoMoo8EcRlF5dAkLiIp', 'tonmoyhassantomal@gmail.com', '01627361360', 'A+', 'Dropped', '', '', '', 'https://www.facebook.com/share/1MfbNniFyR/?mibextid=wwXIfr', 37);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (38, 'Muhammad Ashrafull Islam', 'Joint Secretary of Quizzing Affairs', 'HSC ''2022', 'https://lh3.googleusercontent.com/d/1TotF9mIP7Sgm2Fbl5ckWK4UoBcrGeO4I', 'iamnaeem85@gmail.com', '01852142312', 'A+', 'Agriculture · Patuakhali Science and Technology University (2028)', '', '', '', 'https://facebook.com/ashrafull.IslamNaeem.3rd', 38);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (39, 'Yasir Hasan Tushi', 'IFB', 'HSC ''2018', 'https://lh3.googleusercontent.com/d/1rlCXpu2nUQ7Noy2fAcQ2u3q0Z7HH9C6R', 'ayeaaseer@gmail.com', '01521572291', 'B+', 'Bengali · University of Chittagong (2024)', 'MA · Bengali · University of Chittagong (2025)', '', '', '', 39);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (40, 'Abdullahel Mahmud Alvi', 'Vice President of Rocketry and Robotics', 'HSC ''2025', 'https://lh3.googleusercontent.com/d/1EnHfxsk0aIq4aKT9XsZemcAFGnvjMIMB', 'abdullahelmahmudalvi@gmail.com', '01758397934', 'B+', '', '', '', '', 'https://www.facebook.com/share/1CjLi51ZHF/', 40);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (41, 'Syed Shadab Hasan', 'Vice President of Project Display and Research Paper', 'HSC ''2025', 'https://lh3.googleusercontent.com/d/1MgsfAbeqJcSpVHFQLjJ1ado0EZZsbjM3', 'shadabdu25@gmail.com', '01841513176', 'AB+', 'Genetic Engineering and Biotechnology · University of Dhaka (2030)', '', '', '', 'https://www.facebook.com/profile.php?id=61576475337022', 41);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (42, 'Hamza Shaheed', 'Joint Secretary of Press & Publication', 'HSC ''2025', 'https://lh3.googleusercontent.com/d/1hduj-b-NsslGFPWx6SA0o5ZgLBj8YQbq', 'hamza.shaheed@outlook.com', '01320305860', 'O+', 'Physics · Shahjalal University of Science and Technology (2030 (Approx.))', '', '', '', 'https://www.linkedin.com/in/hamza-shaheed/', 42);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (43, 'Swagata Saha', 'General Secretary', 'HSC ''2015', 'https://lh3.googleusercontent.com/d/1w2gZWSGW-Z_qQ3NV3DxCMmEg09vBve_9', 'swagatasahajitu@gmail.com', '+358413171119', 'AB+', 'Petroleum and Mining Engineering · MIST (2020)', 'M.Sc. · Environmental Engineering · University of Oulu, Finland (2023)', '', 'Software UA tester', 'https://www.linkedin.com/in/swagata-saha-mist/', 43);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (44, 'Hridoy Saha', 'VP (Olympiad)', 'HSC ''2018', 'https://lh3.googleusercontent.com/d/1MzYyAPrEeASZCzmgN1j7iN3EY2tiQPJh', 'hsaha1004@gmail.com', '01630839685/01751064570', 'O+', 'Pharmacy (B.Pharm) · University of Asia Pacific - UAP (January, 2025)', 'Master of Pharmacy (M.Pharm) · Pharmaceutical Technology · University of Asia Pacific - UAP (September, 2026)', '', 'Probationary Member/Ignite - International Business Division (IBD) at Renata PLC', 'https://Facebook : https://www.facebook.com/share/1A3X636iZT/

Instagram : https://www.instagram.com/_hridoy_saha_?mdxt=MTRnNGZiMjlrOHVlag==


LinkedIn : https://www.linkedin.com/in/hridoy-saha-74350a280', 44);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (45, 'Mahmudul Hasan Mahi', 'Joint Secretary of Project  Display and Recherchpaper', 'HSC ''2025', 'https://lh3.googleusercontent.com/d/18Gbhi1d9mjyLC0_-MRcjavjvAXnQ19L-', 'mahmudul8830@gmail.com', '01791188830', 'B+', 'Internet  of Things  and Robotics  Engineering · University of Frontier  Technology,  Bangladesh (.)', '', '', '', 'https://www.facebook.com/share/17aHnP38hp/', 45);
INSERT INTO alumni_members (id, name, role, batch, photo, email, phone, blood, undergrad, postgrad, other_degrees, current_position, social_url, display_order) VALUES (46, 'MD. RASHEDUL ISLAM', 'Vice president of wall magazine and poster design.', 'HSC ''2022', 'https://lh3.googleusercontent.com/d/1HBcyzNDXEaFDWWbuWWfK032NI5Q5pIHO', 'ri998188@gmail.com', '+8801610275588', 'A+', 'Botany · National University (2027)', '', '', '', 'https://www.facebook.com/Rashed4422', 46);

-- 2. EXECUTIVE COMMITTEE TABLE
CREATE TABLE IF NOT EXISTS executive_members (
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
);
INSERT INTO executive_members (id, name, role, department, session, photo, phone, email, blood, bio, display_order) VALUES (1, 'Arif Hossain', 'President', 'Central Executive Committee', 'Batch ''24', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800', '01712000010', 'president.gscsc@gmail.com', 'B+', 'Chief executive leading club governance, national festival planning, and collegiate research partnerships.', 1);
INSERT INTO executive_members (id, name, role, department, session, photo, phone, email, blood, bio, display_order) VALUES (2, 'Nusrat Jahan', 'General Secretary', 'Administration Wing', 'Batch ''24', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800', '01712000011', 'gs.gscsc@gmail.com', 'A+', 'Managing overall club administrative workflow, inter-wing coordination, and member relations.', 2);
INSERT INTO executive_members (id, name, role, department, session, photo, phone, email, blood, bio, display_order) VALUES (3, 'Rafid Karim', 'Treasurer', 'Finance & Accounts Wing', 'Batch ''24', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800', '01712000012', 'treasurer.gscsc@gmail.com', 'O+', 'Supervising club financial audits, budget allocations for rocketry tests, and sponsor grants.', 3);
INSERT INTO executive_members (id, name, role, department, session, photo, phone, email, blood, bio, display_order) VALUES (4, 'Lamia Islam', 'Joint Secretary (Admin)', 'Internal Operations', 'Batch ''24', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800', '01712000013', 'js.admin.gscsc@gmail.com', 'AB+', 'Coordinating internal departmental operations and general executive training bootcamps.', 4);
INSERT INTO executive_members (id, name, role, department, session, photo, phone, email, blood, bio, display_order) VALUES (5, 'Kazi Al-Amin', 'Joint Secretary (Events)', 'Festival Affairs & Logistics', 'Batch ''24', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=800', '01712000014', 'js.events.gscsc@gmail.com', 'B+', 'Lead logistical planner for the annual National Science & Technology Festival.', 5);
INSERT INTO executive_members (id, name, role, department, session, photo, phone, email, blood, bio, display_order) VALUES (6, 'Shahriar Nafis', 'Head of IT & Automation', 'IT & Software Wing', 'Batch ''24', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800', '01712000015', 'it.head.gscsc@gmail.com', 'O+', 'Lead developer managing cloud servers, automated registration systems, and digital portals.', 6);
INSERT INTO executive_members (id, name, role, department, session, photo, phone, email, blood, bio, display_order) VALUES (7, 'Tanvir Ahmed', 'Head of Rocketry & Robotics', 'Engineering Division (GSC Falcon)', 'Batch ''24', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800', '01712000016', 'falcon.head.gscsc@gmail.com', 'A+', 'Lead avionics & propulsion engineer for Project Orbitfall and sounding rocket flight tests.', 7);
INSERT INTO executive_members (id, name, role, department, session, photo, phone, email, blood, bio, display_order) VALUES (8, 'Farida Haque', 'Head of Press & Media', 'Publications & Visual Media', 'Batch ''24', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', '01712000017', 'media.gscsc@gmail.com', 'B+', 'Chief editorial designer for annual club magazine, research digests, and photo coverage.', 8);
INSERT INTO executive_members (id, name, role, department, session, photo, phone, email, blood, bio, display_order) VALUES (9, 'Mehedi Hasan', 'Head of Olympiad Circuit', 'Academic Wings & Training', 'Batch ''24', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', '01712000018', 'olympiad.gscsc@gmail.com', 'AB-', 'Head coach for national math, physics, informatics, and astrophysics Olympiad squads.', 9);

-- 3. CLUB MODERATORS TABLE
CREATE TABLE IF NOT EXISTS club_moderators (
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
);
INSERT INTO club_moderators (id, name, designation, department, tag, bio, photo, phone, email, display_order) VALUES (1, 'Prof. Md. Abdul Jalil', 'Chief Patron & Principal', 'Govt. Science College, Dhaka', 'College Principal & Patron', 'Distinguished academic leader patronizing GSCSC''s scientific initiatives, national festivals, and aerospace innovation since college inception.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', '01711000001', 'principal@gsc.edu.bd', 1);
INSERT INTO club_moderators (id, name, designation, department, tag, bio, photo, phone, email, display_order) VALUES (2, 'Dr. Nazmul Huda', 'Chief Moderator & Associate Professor', 'Department of Physics', 'Physics & Research Advisor', 'Senior faculty mentor leading Olympiad coaching bootcamps, experimental rocketry, and scientific project vetting for national competitions.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', '01711000002', 'nazmul.physics@gsc.edu.bd', 2);
INSERT INTO club_moderators (id, name, designation, department, tag, bio, photo, phone, email, display_order) VALUES (3, 'Mrs. Shahnaz Parveen', 'Co-Moderator & Assistant Professor', 'Department of Chemistry', 'Chemistry & Operations Advisor', 'Dedicated faculty mentor overseeing club administration, member welfare, research ethics, and publication standards across all 10 specialized wings.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800', '01711000003', 'shahnaz.chem@gsc.edu.bd', 3);
INSERT INTO club_moderators (id, name, designation, department, tag, bio, photo, phone, email, display_order) VALUES (4, 'Mohammad Zahidul Islam', 'Faculty Advisor & Senior Lecturer', 'Department of Mathematics', 'Mathematics & Olympiad Lead', 'Mentoring competitive Olympiad contestants, mathematical simulation for sounding rocket aerodynamics, and statistical research methods.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800', '01711000004', 'zahidul.math@gsc.edu.bd', 4);
INSERT INTO club_moderators (id, name, designation, department, tag, bio, photo, phone, email, display_order) VALUES (5, 'Dr. Farhana Yasmin', 'Faculty Advisor & Assistant Professor', 'Department of Biology & Botany', 'Life Sciences & Bio-Tech', 'Guiding biotechnology research, eco-science projects, laboratory instrumentation, and international biology Olympiad preparation.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800', '01711000005', 'farhana.bio@gsc.edu.bd', 5);

-- 4. EVENTS & FESTIVALS TABLE
CREATE TABLE IF NOT EXISTS events_festivals (
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
);
INSERT INTO events_festivals (id, title, description, date, location, category, registration_link, is_active, is_upcoming) VALUES (1, '12th National Science & Tech Carnival 2025', 'Flagship 3-day nationwide festival with Olympiad circuits, project display, drone racing, and astrophysics summits.', 'November 20-22, 2025', 'Govt. Science College Campus, Tejgaon', 'National Carnival', 'https://forms.gle/gscsc-carnival-2025', TRUE, TRUE);
INSERT INTO events_festivals (id, title, description, date, location, category, registration_link, is_active, is_upcoming) VALUES (2, 'GSC Falcon Sounding Rocket Workshop & Static Test', 'Hands-on model rocketry simulation, solid motor ignition safety protocols, and live payload data acquisition workshop.', 'April 05, 2025', 'Aerospace Lab & College Field', 'Rocketry Workshop', 'https://forms.gle/falcon-workshop-2025', TRUE, TRUE);
INSERT INTO events_festivals (id, title, description, date, location, category, registration_link, is_active, is_upcoming) VALUES (3, '11th National Science & Tech Festival', 'Over 3,500 delegates from 120+ institutions across Bangladesh competed in model making, science quiz, and Olympiad circuits.', 'December 2023', 'Govt. Science College, Dhaka', 'National Festival', NULL, TRUE, FALSE);

-- 5. CLUB PARTNERS TABLE
CREATE TABLE IF NOT EXISTS club_partners (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    website TEXT,
    description TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO club_partners (id, name, type, website, description, is_active) VALUES (1, 'Bangladesh Science Society (BSS)', 'Academic Partner', 'https://bss.org.bd', 'National science promotion body collaborating on countrywide science fairs and olympiad mentoring.', TRUE);
INSERT INTO club_partners (id, name, type, website, description, is_active) VALUES (2, 'BUET Science Club', 'Club Partner', 'https://buet.ac.bd', 'Inter-collegiate academic collaboration for high-level robotics, physics olympiad training, and hackathons.', TRUE);
INSERT INTO club_partners (id, name, type, website, description, is_active) VALUES (3, 'Dhaka Regional Science Fair', 'Event Sponsor & Partner', '', 'Annual co-organizer and festival partner for regional talent hunt competitions and STEM exhibitions.', TRUE);
INSERT INTO club_partners (id, name, type, website, description, is_active) VALUES (4, 'Bangladesh Astronomical Association', 'Research & Workshop Partner', 'https://astronomy.org.bd', 'Stargazing camps, telescope building sessions, and deep-space observation workshops.', TRUE);
INSERT INTO club_partners (id, name, type, website, description, is_active) VALUES (5, 'Govt. Science College Alumni Association', 'Endowment Partner', '', 'Supporting research projects, Falcon rocketry flight trials, and student scholarship grants.', TRUE);

-- 6. JOIN REQUESTS TABLE
CREATE TABLE IF NOT EXISTS join_requests (
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
);

-- 7. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. ADMIN & STAFF USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO admin_users (username, password_hash, name, role) VALUES ('jim', 'jim1234', 'Jim', 'administrator');
INSERT INTO admin_users (username, password_hash, name, role) VALUES ('gscscstuff', '@gscscstuff1981', 'GSCSC Staff', 'staff');
