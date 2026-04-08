// server/models/LockerFile.js
import mongoose from "mongoose";

const LOCKER_LIMIT_BYTES = 100 * 1024 * 1024; // 100MB

const lockerFileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  originalName: { type: String, required: true, trim: true },
  storedName: { type: String, required: true }, // unique filename on disk
  displayName: { type: String, trim: true }, // user can rename
  mimeType: { type: String, trim: true },
  size: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

lockerFileSchema.statics.getTotalSizeForUser = async function (userId) {
  const result = await this.aggregate([{ $match: { userId } }, { $group: { _id: null, total: { $sum: "$size" } } }]);
  return (result[0] && result[0].total) || 0;
};
lockerFileSchema.statics.LIMIT_BYTES = LOCKER_LIMIT_BYTES;

const LockerFile = mongoose.models.LockerFile || mongoose.model("LockerFile", lockerFileSchema);
export default LockerFile;
