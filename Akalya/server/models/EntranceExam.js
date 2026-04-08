// server/models/EntranceExam.js
import mongoose from "mongoose";

const entranceExamSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, trim: true, unique: true },
  level: { type: String, enum: ["national", "state"], default: "national" },
  state: { type: String, trim: true }, // for state-level: Telangana, AP, Karnataka, etc.
  overview: { type: String, trim: true, maxlength: 3000 },
  eligibility: { type: String, trim: true, maxlength: 2000 },
  ageLimit: { type: String, trim: true, maxlength: 500 },
  examPattern: { type: String, trim: true, maxlength: 3000 },
  syllabus: { type: String, trim: true, maxlength: 5000 },
  importantDates: { type: String, trim: true, maxlength: 2000 },
  officialWebsite: { type: String, trim: true, maxlength: 500 },
  careerOpportunities: { type: String, trim: true, maxlength: 2000 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

entranceExamSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  if (!this.slug && this.name) {
    this.slug = this.name.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "");
  }
  next();
});

const EntranceExam = mongoose.models.EntranceExam || mongoose.model("EntranceExam", entranceExamSchema);
export default EntranceExam;
