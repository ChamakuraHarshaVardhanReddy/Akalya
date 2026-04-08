// server/controllers/lockerController.js
import LockerFile from "../models/LockerFile.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "..", "uploads", "locker");
const ALLOWED_MIMES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file

function ensureUserDir(userId) {
  const userPath = path.join(UPLOAD_DIR, String(userId));
  if (!fs.existsSync(userPath)) fs.mkdirSync(userPath, { recursive: true });
  return userPath;
}

export const listFiles = async (req, res) => {
  try {
    const files = await LockerFile.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.json(files.map((f) => ({ ...f, id: f._id, displayName: f.displayName || f.originalName })));
  } catch (err) {
    console.error("locker listFiles:", err);
    return res.status(500).json({ error: "Failed to list files" });
  }
};

export const getUsage = async (req, res) => {
  try {
    const total = await LockerFile.getTotalSizeForUser(req.user.id);
    return res.json({ usedBytes: total, limitBytes: 100 * 1024 * 1024 });
  } catch (err) {
    console.error("locker getUsage:", err);
    return res.status(500).json({ error: "Failed to get usage" });
  }
};

export const upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const mime = (req.file.mimetype || "").toLowerCase();
    if (!ALLOWED_MIMES.includes(mime)) return res.status(400).json({ error: "File type not allowed. Use PDF, images, or Word documents." });
    if (req.file.size > MAX_FILE_SIZE) return res.status(400).json({ error: "File too large. Maximum 10MB per file." });
    const total = await LockerFile.getTotalSizeForUser(req.user.id);
    const limit = 100 * 1024 * 1024;
    if (total + req.file.size > limit) return res.status(400).json({ error: "Storage limit (100MB) exceeded." });
    const storedName = req.file.filename;
    const doc = new LockerFile({
      userId: req.user.id,
      originalName: req.file.originalname || storedName,
      storedName,
      displayName: req.file.originalname || storedName,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
    await doc.save();
    return res.status(201).json({
      id: doc._id,
      originalName: doc.originalName,
      displayName: doc.displayName,
      size: doc.size,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    console.error("locker upload:", err);
    return res.status(500).json({ error: "Failed to upload file" });
  }
};

export const rename = async (req, res) => {
  try {
    const { displayName } = req.body;
    const doc = await LockerFile.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ error: "File not found" });
    doc.displayName = typeof displayName === "string" ? displayName.trim() || doc.originalName : doc.displayName;
    await doc.save();
    return res.json(doc);
  } catch (err) {
    console.error("locker rename:", err);
    return res.status(500).json({ error: "Failed to rename file" });
  }
};

export const remove = async (req, res) => {
  try {
    const doc = await LockerFile.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ error: "File not found" });
    const userPath = path.join(UPLOAD_DIR, String(req.user.id), doc.storedName);
    if (fs.existsSync(userPath)) fs.unlinkSync(userPath);
    await doc.deleteOne();
    return res.json({ success: true });
  } catch (err) {
    console.error("locker remove:", err);
    return res.status(500).json({ error: "Failed to delete file" });
  }
};

export const download = async (req, res) => {
  try {
    const doc = await LockerFile.findOne({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ error: "File not found" });
    const filePath = path.join(UPLOAD_DIR, String(req.user.id), doc.storedName);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found on server" });
    const name = (doc.displayName || doc.originalName || doc.storedName).replace(/[^a-zA-Z0-9._-]/g, "_");
    res.setHeader("Content-Disposition", `attachment; filename="${name}"`);
    res.setHeader("Content-Type", doc.mimeType || "application/octet-stream");
    return res.sendFile(path.resolve(filePath));
  } catch (err) {
    console.error("locker download:", err);
    return res.status(500).json({ error: "Failed to download file" });
  }
};
