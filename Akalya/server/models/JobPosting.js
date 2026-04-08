// server/models/JobPosting.js
import mongoose from "mongoose";

const jobPostingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  category: { type: String, enum: ["govt_10", "skill_10", "govt_12", "private_12"], required: true },
  description: { type: String, trim: true, maxlength: 3000 },
  eligibility: { type: String, trim: true, maxlength: 1500 },
  ageLimit: { type: String, trim: true, maxlength: 300 },
  selectionProcess: { type: String, trim: true, maxlength: 1500 },
  salaryRange: { type: String, trim: true, maxlength: 300 },
  promotionPath: { type: String, trim: true, maxlength: 1000 },
  officialWebsite: { type: String, trim: true, maxlength: 500 },
  requiredCertification: { type: String, trim: true, maxlength: 500 },
  skillTrainingOptions: { type: String, trim: true, maxlength: 1000 },
  itiCoursesRelated: { type: String, trim: true, maxlength: 500 },
  examRequired: { type: String, trim: true, maxlength: 300 },
  growthPath: { type: String, trim: true, maxlength: 1000 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

jobPostingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const JobPosting = mongoose.models.JobPosting || mongoose.model("JobPosting", jobPostingSchema);
export default JobPosting;
