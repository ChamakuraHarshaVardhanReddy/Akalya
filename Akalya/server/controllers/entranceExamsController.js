// server/controllers/entranceExamsController.js
import EntranceExam from "../models/EntranceExam.js";

export const getAll = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.level) filter.level = req.query.level;
    if (req.query.state) filter.state = new RegExp(req.query.state, "i");
    const list = await EntranceExam.find(filter).sort({ level: 1, name: 1 });
    return res.json(list);
  } catch (err) {
    console.error("entranceExams getAll:", err);
    return res.status(500).json({ error: "Failed to fetch exams" });
  }
};

export const getBySlug = async (req, res) => {
  try {
    const doc = await EntranceExam.findOne({ slug: req.params.slug, isActive: true });
    if (!doc) return res.status(404).json({ error: "Exam not found" });
    return res.json(doc);
  } catch (err) {
    console.error("entranceExams getBySlug:", err);
    return res.status(500).json({ error: "Failed to fetch exam" });
  }
};

export const getById = async (req, res) => {
  try {
    const doc = await EntranceExam.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Exam not found" });
    return res.json(doc);
  } catch (err) {
    console.error("entranceExams getById:", err);
    return res.status(500).json({ error: "Failed to fetch exam" });
  }
};

export const create = async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.name.trim()) return res.status(400).json({ error: "Name is required" });
    const doc = new EntranceExam(body);
    await doc.save();
    return res.status(201).json(doc);
  } catch (err) {
    console.error("entranceExams create:", err);
    return res.status(500).json({ error: "Failed to create exam" });
  }
};

export const update = async (req, res) => {
  try {
    const doc = await EntranceExam.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Exam not found" });
    Object.assign(doc, req.body);
    await doc.save();
    return res.json(doc);
  } catch (err) {
    console.error("entranceExams update:", err);
    return res.status(500).json({ error: "Failed to update exam" });
  }
};

export const remove = async (req, res) => {
  try {
    const doc = await EntranceExam.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Exam not found" });
    await doc.deleteOne();
    return res.json({ success: true });
  } catch (err) {
    console.error("entranceExams remove:", err);
    return res.status(500).json({ error: "Failed to delete exam" });
  }
};
