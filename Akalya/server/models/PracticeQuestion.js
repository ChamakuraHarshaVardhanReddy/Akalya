// server/models/PracticeQuestion.js
import mongoose from "mongoose";

const practiceQuestionSchema = new mongoose.Schema({
  classLevel: { type: Number, required: true, min: 6, max: 12 },
  subject: { type: String, required: true, trim: true },
  topic: { type: String, trim: true },
  question: { type: String, required: true, trim: true, maxlength: 2000 },
  options: [{ type: String, required: true }], // 4 options
  correctIndex: { type: Number, required: true, min: 0 },
  explanation: { type: String, trim: true, maxlength: 2000 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

practiceQuestionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const PracticeQuestion = mongoose.models.PracticeQuestion || mongoose.model("PracticeQuestion", practiceQuestionSchema);
export default PracticeQuestion;
