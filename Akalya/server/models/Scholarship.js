// server/models/Scholarship.js
import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 300 },
  description: { type: String, trim: true, maxlength: 5000 },
  provider: { type: String, trim: true, maxlength: 200 },
  amount: { type: String, trim: true }, // e.g. "₹50,000 per year"
  eligibility: { type: String, trim: true, maxlength: 2000 },
  deadline: { type: Date },
  applicationUrl: { type: String, trim: true, maxlength: 500 },
  category: { type: String, trim: true }, // merit, need-based, caste, etc.
  forClass: { type: String, trim: true }, // 10, 12, graduation, etc.
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

scholarshipSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Scholarship = mongoose.models.Scholarship || mongoose.model("Scholarship", scholarshipSchema);
export default Scholarship;
