// server/controllers/jobsController.js
import JobPosting from "../models/JobPosting.js";

export const getAll = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    const list = await JobPosting.find(filter).sort({ category: 1, title: 1 });
    return res.json(list);
  } catch (err) {
    console.error("jobs getAll:", err);
    return res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

export const getById = async (req, res) => {
  try {
    const doc = await JobPosting.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Job not found" });
    return res.json(doc);
  } catch (err) {
    console.error("jobs getById:", err);
    return res.status(500).json({ error: "Failed to fetch job" });
  }
};

export const create = async (req, res) => {
  try {
    const body = req.body;
    if (!body.title || !body.title.trim()) return res.status(400).json({ error: "Title is required" });
    if (!body.category) return res.status(400).json({ error: "Category is required" });
    const doc = new JobPosting({ ...body, createdBy: req.user.id });
    await doc.save();
    return res.status(201).json(doc);
  } catch (err) {
    console.error("jobs create:", err);
    return res.status(500).json({ error: "Failed to create job" });
  }
};

export const update = async (req, res) => {
  try {
    const doc = await JobPosting.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Job not found" });
    Object.assign(doc, req.body);
    await doc.save();
    return res.json(doc);
  } catch (err) {
    console.error("jobs update:", err);
    return res.status(500).json({ error: "Failed to update job" });
  }
};

export const remove = async (req, res) => {
  try {
    const doc = await JobPosting.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Job not found" });
    await doc.deleteOne();
    return res.json({ success: true });
  } catch (err) {
    console.error("jobs remove:", err);
    return res.status(500).json({ error: "Failed to delete job" });
  }
};
