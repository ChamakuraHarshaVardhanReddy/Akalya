// server/scripts/seed-exams-and-jobs.js
// Run from server folder: node scripts/seed-exams-and-jobs.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import EntranceExam from "../models/EntranceExam.js";
import JobPosting from "../models/JobPosting.js";

dotenv.config();

const nationalExams = [
  { name: "JEE Main", level: "national", overview: "Joint Entrance Examination Main for admission to NITs, IIITs and CFTIs.", eligibility: "Class 12 with PCM. No age limit for appearing.", ageLimit: "No upper age limit.", examPattern: "Computer-based; Physics, Chemistry, Mathematics; 90 questions, 300 marks.", syllabus: "Physics, Chemistry, Mathematics from Class 11-12 NCERT.", importantDates: "Check NTA website for application and exam dates.", officialWebsite: "https://jeemain.nta.nic.in", careerOpportunities: "B.Tech in NITs, IIITs, CFTIs; B.Arch; B.Planning." },
  { name: "JEE Advanced", level: "national", overview: "For admission to IITs. Only JEE Main qualifiers can apply.", eligibility: "Top 2.5 lakh rank in JEE Main. One attempt in the year after Class 12.", ageLimit: "Must be born on or after October 1, 1998 (relaxation for reserved categories).", examPattern: "Two papers; PCM; objective and numerical.", syllabus: "Physics, Chemistry, Mathematics - Class 11-12.", importantDates: "After JEE Main results.", officialWebsite: "https://jeeadv.ac.in", careerOpportunities: "B.Tech/B.S in IITs." },
  { name: "NEET UG", level: "national", overview: "National Eligibility cum Entrance Test for MBBS, BDS, AYUSH and other medical courses.", eligibility: "Class 12 with PCB; minimum 50% (40% for SC/ST/OBC).", ageLimit: "Minimum 17 years as on 31 Dec of admission year. Upper limit as per norms.", examPattern: "720 marks; 200 MCQ; Physics, Chemistry, Botany, Zoology.", syllabus: "NCERT Class 11-12 Biology, Physics, Chemistry.", importantDates: "Usually May; check NTA NEET.", officialWebsite: "https://neet.nta.nic.in", careerOpportunities: "MBBS, BDS, BAMS, BHMS, BVSc, etc." },
  { name: "CUET", level: "national", overview: "Common University Entrance Test for central and many state universities.", eligibility: "Class 12 passed or appearing.", ageLimit: "No upper age limit.", examPattern: "Multiple subjects; section-wise; computer-based.", syllabus: "NCERT-based; domain and general test.", importantDates: "Check NTA CUET.", officialWebsite: "https://cuet.samarth.ac.in", careerOpportunities: "UG programmes in participating universities." },
  { name: "CLAT", level: "national", overview: "Common Law Admission Test for NLUs and other law colleges.", eligibility: "Class 12 for UG; no minimum percentage for many NLUs.", ageLimit: "No upper age limit for UG.", examPattern: "120 questions; English, GK, Legal Aptitude, Logical Reasoning, Quantitative Techniques.", syllabus: "As per CLAT consortium.", importantDates: "Usually December; check consortium.", officialWebsite: "https://consortiumofnlus.ac.in", careerOpportunities: "BA LLB, B.Com LLB in NLUs." },
  { name: "NDA", level: "national", overview: "National Defence Academy entrance for Army, Navy, Air Force.", eligibility: "Class 12 (for Army) or 12th with PCM (for Navy/Air Force).", ageLimit: "16.5 to 19.5 years.", examPattern: "Written (Math + GAT) then SSB.", syllabus: "Math up to Class 12; GAT: English, GK.", importantDates: "Twice a year - UPSC NDA.", officialWebsite: "https://upsc.gov.in", careerOpportunities: "Officer in Indian Armed Forces." },
  { name: "NIFT", level: "national", overview: "National Institute of Fashion Technology entrance for design programmes.", eligibility: "Class 12 from recognised board.", ageLimit: "As per NIFT notification.", examPattern: "Creative ability test, GAT, situation test for some courses.", syllabus: "Design aptitude, general ability.", importantDates: "Check NIFT website.", officialWebsite: "https://nift.ac.in", careerOpportunities: "Fashion design, management, technology." },
  { name: "NID", level: "national", overview: "National Institute of Design entrance for design courses.", eligibility: "Class 12 or equivalent.", ageLimit: "As per NID.", examPattern: "Design aptitude test and studio test.", syllabus: "Design, creativity, observation.", importantDates: "Check NID.", officialWebsite: "https://nid.edu", careerOpportunities: "Product design, communication design, etc." },
  { name: "SSC CGL/CHSL/MTS", level: "national", overview: "Staff Selection Commission exams for various government posts.", eligibility: "Varies: 10th for MTS; 12th for CHSL; graduation for CGL.", ageLimit: "18-32 typically; relaxation for reserved.", examPattern: "Tier 1 (MCQ), Tier 2 (descriptive/computer).", syllabus: "Reasoning, quantitative aptitude, English, GK.", importantDates: "Check ssc.nic.in.", officialWebsite: "https://ssc.nic.in", careerOpportunities: "Clerk, assistant, inspector, etc." },
  { name: "Banking Exams", level: "national", overview: "IBPS, SBI exams for clerk, PO and specialist posts.", eligibility: "Graduation for PO/Clerk; 12th for some posts.", ageLimit: "Usually 20-30; relaxation for reserved.", examPattern: "Prelims + Mains; reasoning, quant, English, GK.", syllabus: "As per IBPS/SBI notification.", importantDates: "Check IBPS/SBI.", officialWebsite: "https://ibps.in", careerOpportunities: "Bank PO, Clerk, Specialist." },
  { name: "Railway Exams", level: "national", overview: "RRB NTPC, Group D, ALP for railway jobs.", eligibility: "10th/12th/graduation as per post.", ageLimit: "18-33 typically.", examPattern: "CBT; general awareness, reasoning, maths.", syllabus: "As per RRB notification.", importantDates: "Check indianrailways.gov.in.", officialWebsite: "https://indianrailways.gov.in", careerOpportunities: "Station master, clerk, technician, etc." },
];

const stateExams = [
  { name: "TSPSC", level: "state", state: "Telangana", overview: "Telangana State Public Service Commission for state civil services.", eligibility: "As per post; usually graduation.", ageLimit: "As per notification.", examPattern: "Prelims and Mains for Group I/II.", syllabus: "State syllabus and general studies.", importantDates: "Check tspsc.gov.in.", officialWebsite: "https://tspsc.gov.in", careerOpportunities: "State government posts." },
  { name: "APPSC", level: "state", state: "Andhra Pradesh", overview: "Andhra Pradesh Public Service Commission.", eligibility: "Varies by post.", ageLimit: "As per notification.", examPattern: "Prelims, Mains, interview.", syllabus: "State and general studies.", importantDates: "Check psc.ap.gov.in.", officialWebsite: "https://psc.ap.gov.in", careerOpportunities: "AP state government jobs." },
  { name: "KCET", level: "state", state: "Karnataka", overview: "Karnataka Common Entrance Test for professional courses.", eligibility: "Class 12 with PCB/PCM as required.", ageLimit: "As per KEA.", examPattern: "Physics, Chemistry, Mathematics/Biology.", syllabus: "State board Class 11-12.", importantDates: "Check kea.kar.nic.in.", officialWebsite: "https://cetonline.karnataka.gov.in", careerOpportunities: "Engineering, medical, pharmacy in Karnataka." },
  { name: "MHCET", level: "state", state: "Maharashtra", overview: "Maharashtra Common Entrance Test for engineering, pharmacy, law.", eligibility: "Class 12 from recognised board.", ageLimit: "As per state norms.", examPattern: "PCM/PCB or law as per course.", syllabus: "State board syllabus.", importantDates: "Check cetcell.mahacet.org.", officialWebsite: "https://cetcell.mahacet.org", careerOpportunities: "UG courses in Maharashtra." },
  { name: "TNEA/TNPSC", level: "state", state: "Tamil Nadu", overview: "TN Engineering Admission / TN PSC for state admissions and jobs.", eligibility: "Class 12 for TNEA; varies for TNPSC.", ageLimit: "As per notification.", examPattern: "Merit-based for TNEA; exams for TNPSC.", syllabus: "State syllabus.", importantDates: "Check tnea.ac.in / tnpsc.gov.in.", officialWebsite: "https://tnea.ac.in", careerOpportunities: "Engineering and government jobs in TN." },
];

const jobsAfter10 = [
  { title: "Indian Army (Soldier GD)", category: "govt_10", eligibility: "Class 10 pass; physical standards as per notification.", ageLimit: "17.5-21 years.", selectionProcess: "Physical fitness, written exam, medical.", salaryRange: "As per 7th CPC; starting around ₹25,000-35,000.", promotionPath: "Soldier to Havaldar and beyond.", officialWebsite: "https://joinindianarmy.nic.in" },
  { title: "Indian Navy (MR)", category: "govt_10", eligibility: "Class 10 with 50% (with Maths and Science).", ageLimit: "17-20 years.", selectionProcess: "Written test, physical fitness, medical.", salaryRange: "As per pay matrix.", promotionPath: "Sailor to higher ranks.", officialWebsite: "https://joinindiannavy.gov.in" },
  { title: "Indian Air Force (Group Y)", category: "govt_10", eligibility: "Class 10 pass.", ageLimit: "17-21 years.", selectionProcess: "Online test, physical fitness, medical.", salaryRange: "As per 7th CPC.", promotionPath: "Airman to NCO and beyond.", officialWebsite: "https://careerindianairforce.cdac.in" },
  { title: "Railway Group D", category: "govt_10", eligibility: "Class 10 or equivalent.", ageLimit: "18-33 years.", selectionProcess: "CBT, physical efficiency test.", salaryRange: "Level 1; ₹18,000-56,000.", promotionPath: "As per railway norms.", officialWebsite: "https://indianrailways.gov.in" },
  { title: "SSC MTS", category: "govt_10", eligibility: "Class 10 from recognised board.", ageLimit: "18-25 years.", selectionProcess: "Computer-based exam in two papers.", salaryRange: "As per pay level.", promotionPath: "Multi-tasking to higher posts.", officialWebsite: "https://ssc.nic.in" },
  { title: "Police Constable", category: "govt_10", eligibility: "Class 10; state-wise norms.", ageLimit: "Usually 18-25.", selectionProcess: "Written, PET, medical.", salaryRange: "State pay scale.", promotionPath: "Constable to SI and above.", officialWebsite: "State police recruitment." },
  { title: "Post Office GDS", category: "govt_10", eligibility: "Class 10; local residency.", ageLimit: "18-40.", selectionProcess: "Merit-based on Class 10 marks.", salaryRange: "As per GDS norms.", promotionPath: "BPM/ABPM to higher.", officialWebsite: "https://indiapost.gov.in" },
  { title: "Electrician", category: "skill_10", eligibility: "Class 10; ITI in Electrician preferred.", requiredCertification: "ITI Electrician or equivalent.", skillTrainingOptions: "ITI, NSDC courses.", itiCoursesRelated: "Electrician trade.", salaryRange: "₹12,000-25,000 depending on experience." },
  { title: "Fitter", category: "skill_10", eligibility: "Class 10; ITI Fitter.", requiredCertification: "ITI Fitter.", skillTrainingOptions: "ITI, industrial training.", itiCoursesRelated: "Fitter trade.", salaryRange: "₹12,000-28,000." },
  { title: "Data Entry Operator", category: "skill_10", eligibility: "Class 10; typing speed.", requiredCertification: "Basic computer certificate.", skillTrainingOptions: "Short-term courses, NSDC.", salaryRange: "₹10,000-18,000." },
];

const jobsAfter12 = [
  { title: "SSC CHSL", category: "govt_12", eligibility: "Class 12 from recognised board.", ageLimit: "18-27 years.", examRequired: "SSC CHSL.", selectionProcess: "Tier 1 (CBT), Tier 2 (descriptive), Tier 3 (skill test).", salaryRange: "Level 2-4; pay as per 7th CPC.", growthPath: "LDC/DEO/PA/SA to higher posts." },
  { title: "NDA (Officer)", category: "govt_12", eligibility: "Class 12; PCM for Navy/Air Force.", ageLimit: "16.5-19.5 years.", examRequired: "NDA by UPSC.", selectionProcess: "Written then SSB interview.", salaryRange: "Officer pay and allowances.", growthPath: "Officer in Armed Forces." },
  { title: "Railway NTPC", category: "govt_12", eligibility: "Graduation/12th as per post.", ageLimit: "18-33.", examRequired: "RRB NTPC.", selectionProcess: "CBT in two stages.", salaryRange: "Level 2-5.", growthPath: "Station Master, Goods Guard, etc." },
  { title: "Banking Clerk", category: "govt_12", eligibility: "Graduation (some banks allow 12th for specific posts).", ageLimit: "20-28.", examRequired: "IBPS Clerk / SBI Clerk.", selectionProcess: "Prelims + Mains.", salaryRange: "As per bank pay scale.", growthPath: "Clerk to PO and above." },
  { title: "BPO Executive", category: "private_12", eligibility: "Class 12; good communication.", requiredCertification: "None mandatory; English fluency.", growthPath: "Team lead, operations.", salaryRange: "₹12,000-22,000." },
  { title: "Sales Executive", category: "private_12", eligibility: "Class 12; communication skills.", requiredCertification: "Optional sales certifications.", growthPath: "Senior executive, manager.", salaryRange: "₹15,000-30,000." },
  { title: "Digital Marketing Intern", category: "private_12", eligibility: "Class 12; basic digital literacy.", requiredCertification: "Google/ Facebook certifications help.", growthPath: "Executive, specialist.", salaryRange: "₹8,000-20,000 (intern to full-time)." },
];

async function seed() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/Akalya";
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  for (const e of nationalExams) {
    const slug = e.name.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "");
    await EntranceExam.findOneAndUpdate(
      { slug },
      { ...e, slug, isActive: true },
      { upsert: true, new: true }
    );
  }
  for (const e of stateExams) {
    const slug = (e.name + "-" + (e.state || "")).replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "");
    await EntranceExam.findOneAndUpdate(
      { name: e.name, state: e.state },
      { ...e, slug, isActive: true },
      { upsert: true, new: true }
    );
  }
  console.log("Entrance exams seeded.");

  for (const j of jobsAfter10) {
    await JobPosting.findOneAndUpdate(
      { title: j.title, category: j.category },
      { ...j, isActive: true },
      { upsert: true, new: true }
    );
  }
  for (const j of jobsAfter12) {
    await JobPosting.findOneAndUpdate(
      { title: j.title, category: j.category },
      { ...j, isActive: true },
      { upsert: true, new: true }
    );
  }
  console.log("Jobs seeded.");

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
