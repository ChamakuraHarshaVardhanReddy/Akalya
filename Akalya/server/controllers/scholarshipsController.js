// server/controllers/scholarshipsController.js
import Scholarship from "../models/Scholarship.js";

export const getAll = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.forClass) filter.forClass = req.query.forClass;
    const list = await Scholarship.find(filter).sort({ deadline: 1 });
    return res.json(list);
  } catch (err) {
    console.error("scholarships getAll:", err);
    return res.status(500).json({ error: "Failed to fetch scholarships" });
  }
};

export const getById = async (req, res) => {
  try {
    const doc = await Scholarship.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Scholarship not found" });
    return res.json(doc);
  } catch (err) {
    console.error("scholarships getById:", err);
    return res.status(500).json({ error: "Failed to fetch scholarship" });
  }
};

export const create = async (req, res) => {
  try {
    const body = req.body;
    if (!body.title || !body.title.trim()) return res.status(400).json({ error: "Title is required" });
    const doc = new Scholarship({
      ...body,
      createdBy: req.user.id,
    });
    await doc.save();
    return res.status(201).json(doc);
  } catch (err) {
    console.error("scholarships create:", err);
    return res.status(500).json({ error: "Failed to create scholarship" });
  }
};

export const update = async (req, res) => {
  try {
    const doc = await Scholarship.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Scholarship not found" });
    Object.assign(doc, req.body);
    await doc.save();
    return res.json(doc);
  } catch (err) {
    console.error("scholarships update:", err);
    return res.status(500).json({ error: "Failed to update scholarship" });
  }
};

export const remove = async (req, res) => {
  try {
    const doc = await Scholarship.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Scholarship not found" });
    await doc.deleteOne();
    return res.json({ success: true });
  } catch (err) {
    console.error("scholarships remove:", err);
    return res.status(500).json({ error: "Failed to delete scholarship" });
  }
};
