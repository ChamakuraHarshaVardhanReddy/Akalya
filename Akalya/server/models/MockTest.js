// server/models/MockTest.js
import mongoose from "mongoose";

const mockTestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "EntranceExam" },
  examName: { type: String, trim: true },
  type: { type: String, enum: ["full_length", "subject_wise"], default: "full_length" },
  subject: { type: String, trim: true },
  durationMinutes: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

mockTestSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const MockTest = mongoose.models.MockTest || mongoose.model("MockTest", mockTestSchema);
export default MockTest;
