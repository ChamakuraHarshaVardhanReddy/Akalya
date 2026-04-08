// server/controllers/practiceController.js
import PracticeQuestion from "../models/PracticeQuestion.js";
import PracticeAttempt from "../models/PracticeAttempt.js";

export const getQuestions = async (req, res) => {
  try {
    const { classLevel, subject, limit = 10 } = req.query;
    if (!classLevel || !subject) return res.status(400).json({ error: "classLevel and subject are required" });
    const level = parseInt(classLevel, 10);
    if (isNaN(level) || level < 6 || level > 12) return res.status(400).json({ error: "classLevel must be 6-12" });
    const num = Math.min(parseInt(limit, 10) || 10, 50);
    const questions = await PracticeQuestion.find({
      classLevel: level,
      subject: String(subject).trim(),
      isActive: true,
    })
      .select("-correctIndex")
      .limit(num)
      .lean();
    const withIds = questions.map((q) => ({
      ...q,
      id: q._id.toString(),
      options: q.options,
    }));
    return res.json(withIds);
  } catch (err) {
    console.error("practice getQuestions:", err);
    return res.status(500).json({ error: "Failed to fetch questions" });
  }
};

export const submitPractice = async (req, res) => {
  try {
    const { answers, timeSpentSeconds, classLevel, subject } = req.body;
    if (!Array.isArray(answers) || !classLevel || !subject)
      return res.status(400).json({ error: "answers, classLevel, subject required" });
    const results = [];
    let correctCount = 0;
    for (const a of answers) {
      const q = await PracticeQuestion.findById(a.questionId).select("correctIndex").lean();
      const correct = q && q.correctIndex === a.selectedIndex;
      if (correct) correctCount++;
      results.push({
        questionId: a.questionId,
        selectedIndex: a.selectedIndex,
        correct,
      });
    }
    const attempt = new PracticeAttempt({
      userId: req.user.id,
      classLevel: parseInt(classLevel, 10),
      subject: String(subject),
      totalQuestions: answers.length,
      correctCount,
      timeSpentSeconds: parseInt(timeSpentSeconds, 10) || 0,
      answers: results,
    });
    await attempt.save();
    return res.json({
      attemptId: attempt._id,
      correctCount,
      total: answers.length,
      results,
    });
  } catch (err) {
    console.error("practice submitPractice:", err);
    return res.status(500).json({ error: "Failed to submit practice" });
  }
};

export const getExplanation = async (req, res) => {
  try {
    const q = await PracticeQuestion.findById(req.params.id).select("explanation correctIndex options").lean();
    if (!q) return res.status(404).json({ error: "Question not found" });
    return res.json({ explanation: q.explanation, correctIndex: q.correctIndex, options: q.options });
  } catch (err) {
    console.error("practice getExplanation:", err);
    return res.status(500).json({ error: "Failed to fetch explanation" });
  }
};

export const getMyHistory = async (req, res) => {
  try {
    const list = await PracticeAttempt.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50).lean();
    return res.json(list);
  } catch (err) {
    console.error("practice getMyHistory:", err);
    return res.status(500).json({ error: "Failed to fetch history" });
  }
};

// Admin: CRUD for questions
export const adminGetQuestions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.classLevel) filter.classLevel = parseInt(req.query.classLevel, 10);
    if (req.query.subject) filter.subject = req.query.subject;
    const list = await PracticeQuestion.find(filter).sort({ classLevel: 1, subject: 1 }).lean();
    return res.json(list);
  } catch (err) {
    console.error("practice adminGetQuestions:", err);
    return res.status(500).json({ error: "Failed to fetch questions" });
  }
};

export const adminCreateQuestion = async (req, res) => {
  try {
    const { classLevel, subject, topic, question, options, correctIndex, explanation } = req.body;
    if (!question || !options || !Array.isArray(options) || options.length < 2 || typeof correctIndex !== "number")
      return res.status(400).json({ error: "question, options (array), correctIndex required" });
    const doc = new PracticeQuestion({
      classLevel: parseInt(classLevel, 10) || 10,
      subject: subject || "General",
      topic,
      question,
      options,
      correctIndex,
      explanation,
      createdBy: req.user.id,
    });
    await doc.save();
    return res.status(201).json(doc);
  } catch (err) {
    console.error("practice adminCreateQuestion:", err);
    return res.status(500).json({ error: "Failed to create question" });
  }
};

export const adminUpdateQuestion = async (req, res) => {
  try {
    const doc = await PracticeQuestion.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Question not found" });
    Object.assign(doc, req.body);
    await doc.save();
    return res.json(doc);
  } catch (err) {
    console.error("practice adminUpdateQuestion:", err);
    return res.status(500).json({ error: "Failed to update question" });
  }
};

export const adminDeleteQuestion = async (req, res) => {
  try {
    const doc = await PracticeQuestion.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Question not found" });
    await doc.deleteOne();
    return res.json({ success: true });
  } catch (err) {
    console.error("practice adminDeleteQuestion:", err);
    return res.status(500).json({ error: "Failed to delete question" });
  }
};
