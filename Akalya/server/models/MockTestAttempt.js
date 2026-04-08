// server/models/MockTestAttempt.js
import mongoose from "mongoose";

const mockTestAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mockTestId: { type: mongoose.Schema.Types.ObjectId, ref: "MockTest", required: true },
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  timeSpentSeconds: { type: Number, default: 0 },
  answers: [{ questionId: mongoose.Schema.Types.ObjectId, selectedIndex: Number, correct: Boolean }],
  weakTopics: [{ type: String }],
  improvementSuggestions: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const MockTestAttempt = mongoose.models.MockTestAttempt || mongoose.model("MockTestAttempt", mockTestAttemptSchema);
export default MockTestAttempt;
