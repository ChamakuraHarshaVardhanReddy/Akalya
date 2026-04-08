// server/controllers/mockTestsController.js
import MockTest from "../models/MockTest.js";
import MockTestQuestion from "../models/MockTestQuestion.js";
import MockTestAttempt from "../models/MockTestAttempt.js";

export const getAll = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.examId) filter.examId = req.query.examId;
    const list = await MockTest.find(filter).sort({ createdAt: -1 }).lean();
    return res.json(list);
  } catch (err) {
    console.error("mockTests getAll:", err);
    return res.status(500).json({ error: "Failed to fetch tests" });
  }
};

export const getById = async (req, res) => {
  try {
    const test = await MockTest.findById(req.params.id).lean();
    if (!test) return res.status(404).json({ error: "Test not found" });
    const questions = await MockTestQuestion.find({ mockTestId: req.params.id }).sort({ order: 1 }).select("-correctIndex").lean();
    return res.json({ ...test, questions: questions.map((q) => ({ ...q, id: q._id })) });
  } catch (err) {
    console.error("mockTests getById:", err);
    return res.status(500).json({ error: "Failed to fetch test" });
  }
};

export const submitTest = async (req, res) => {
  try {
    const { mockTestId, answers, timeSpentSeconds } = req.body;
    if (!mockTestId || !Array.isArray(answers))
      return res.status(400).json({ error: "mockTestId and answers required" });
    const test = await MockTest.findById(mockTestId).lean();
    if (!test) return res.status(404).json({ error: "Test not found" });
    const allQ = await MockTestQuestion.find({ mockTestId }).lean();
    const qMap = Object.fromEntries(allQ.map((q) => [q._id.toString(), q]));
    let score = 0;
    const results = [];
    const wrongBySubject = {};
    for (const a of answers) {
      const q = qMap[a.questionId];
      const correct = q && q.correctIndex === a.selectedIndex;
      if (correct) score += q.marks || 1;
      results.push({ questionId: a.questionId, selectedIndex: a.selectedIndex, correct });
      if (!correct && q && q.subject) {
        wrongBySubject[q.subject] = (wrongBySubject[q.subject] || 0) + 1;
      }
    }
    const totalMarks = allQ.reduce((s, q) => s + (q.marks || 1), 0);
    const weakTopics = Object.entries(wrongBySubject)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t]) => t);
    const attempt = new MockTestAttempt({
      userId: req.user.id,
      mockTestId,
      score,
      totalMarks,
      timeSpentSeconds: parseInt(timeSpentSeconds, 10) || 0,
      answers: results,
      weakTopics,
      improvementSuggestions: weakTopics.length
        ? `Focus on: ${weakTopics.join(", ")}. Revise these topics and attempt more subject-wise tests.`
        : "Good attempt. Keep practicing full-length tests.",
    });
    await attempt.save();
    return res.json({
      attemptId: attempt._id,
      score,
      totalMarks,
      weakTopics,
      improvementSuggestions: attempt.improvementSuggestions,
      results,
    });
  } catch (err) {
    console.error("mockTests submitTest:", err);
    return res.status(500).json({ error: "Failed to submit test" });
  }
};

export const getMyAttempts = async (req, res) => {
  try {
    const list = await MockTestAttempt.find({ userId: req.user.id })
      .populate("mockTestId", "title examName type durationMinutes")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return res.json(list);
  } catch (err) {
    console.error("mockTests getMyAttempts:", err);
    return res.status(500).json({ error: "Failed to fetch attempts" });
  }
};

// Admin
export const adminCreate = async (req, res) => {
  try {
    const body = req.body;
    if (!body.title) return res.status(400).json({ error: "Title is required" });
    const doc = new MockTest({ ...body, createdBy: req.user.id });
    await doc.save();
    return res.status(201).json(doc);
  } catch (err) {
    console.error("mockTests adminCreate:", err);
    return res.status(500).json({ error: "Failed to create test" });
  }
};

export const adminUpdate = async (req, res) => {
  try {
    const doc = await MockTest.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Test not found" });
    Object.assign(doc, req.body);
    await doc.save();
    return res.json(doc);
  } catch (err) {
    console.error("mockTests adminUpdate:", err);
    return res.status(500).json({ error: "Failed to update test" });
  }
};

export const adminAddQuestion = async (req, res) => {
  try {
    const { mockTestId, question, options, correctIndex, marks, subject, order } = req.body;
    if (!mockTestId || !question || !options || typeof correctIndex !== "number")
      return res.status(400).json({ error: "mockTestId, question, options, correctIndex required" });
    const doc = new MockTestQuestion({
      mockTestId,
      question,
      options,
      correctIndex,
      marks: marks || 1,
      subject,
      order: order || 0,
    });
    await doc.save();
    return res.status(201).json(doc);
  } catch (err) {
    console.error("mockTests adminAddQuestion:", err);
    return res.status(500).json({ error: "Failed to add question" });
  }
};

export const adminDeleteTest = async (req, res) => {
  try {
    const doc = await MockTest.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Test not found" });
    await MockTestQuestion.deleteMany({ mockTestId: req.params.id });
    await doc.deleteOne();
    return res.json({ success: true });
  } catch (err) {
    console.error("mockTests adminDeleteTest:", err);
    return res.status(500).json({ error: "Failed to delete test" });
  }
};
