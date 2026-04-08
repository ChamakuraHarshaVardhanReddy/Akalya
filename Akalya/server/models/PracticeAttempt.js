// server/models/PracticeAttempt.js
import mongoose from "mongoose";

const practiceAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  classLevel: { type: Number, required: true },
  subject: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  timeSpentSeconds: { type: Number, default: 0 },
  answers: [{ questionId: mongoose.Schema.Types.ObjectId, selectedIndex: Number, correct: Boolean }],
  createdAt: { type: Date, default: Date.now },
});

const PracticeAttempt = mongoose.models.PracticeAttempt || mongoose.model("PracticeAttempt", practiceAttemptSchema);
export default PracticeAttempt;
