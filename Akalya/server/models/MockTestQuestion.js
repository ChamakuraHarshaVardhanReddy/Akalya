// server/models/MockTestQuestion.js
import mongoose from "mongoose";

const mockTestQuestionSchema = new mongoose.Schema({
  mockTestId: { type: mongoose.Schema.Types.ObjectId, ref: "MockTest", required: true },
  question: { type: String, required: true, trim: true, maxlength: 2000 },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true, min: 0 },
  marks: { type: Number, default: 1 },
  explanation: { type: String, trim: true, maxlength: 2000 },
  subject: { type: String, trim: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const MockTestQuestion = mongoose.models.MockTestQuestion || mongoose.model("MockTestQuestion", mockTestQuestionSchema);
export default MockTestQuestion;
