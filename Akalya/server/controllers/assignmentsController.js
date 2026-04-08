// server/controllers/assignmentsController.js
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";

/**
 * Create assignment (teacher)
 * Expect body: { courseId, title, description, due_date, max_score }
 * teacherId should come from req.user (auth middleware)
 */
export const createAssignment = async (req, res) => {
  try {
    const teacherId = req.user?.id || req.user?._id;
    const { courseId, title, description, due_date, max_score } = req.body;
    if (!teacherId) return res.status(401).json({ error: "Unauthorized" });
    if (!courseId || !title || !due_date) {
      return res.status(400).json({ error: "courseId, title and due_date are required" });
    }

    const assn = new Assignment({
      courseId,
      teacherId,
      title,
      description,
      due_date: new Date(due_date),
      max_score: max_score ?? 100,
    });

    const saved = await assn.save();
    return res.status(201).json({ assignment: saved });
  } catch (err) {
    console.error("createAssignment error", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const getAssignments = async (req, res) => {
  try {
    // optional filters: courseId, teacherId, status
    const filter = {};
    if (req.query.courseId) filter.courseId = req.query.courseId;
    if (req.query.teacherId) filter.teacherId = req.query.teacherId;
    if (req.query.status) filter.status = req.query.status;

    // populate course/teacher minimal data
    const assignments = await Assignment.find(filter)
      .sort({ due_date: 1 })
      .populate("courseId", "title")
      .populate("teacherId", "fullName email");

    return res.json(assignments);
  } catch (err) {
    console.error("getAssignments error", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("courseId", "title")
      .populate("teacherId", "fullName email");
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });
    return res.json(assignment);
  } catch (err) {
    console.error("getAssignmentById error", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    // Ownership check: only the teacher who created the assignment (or admin) can edit it
    if (req.user?.role !== "admin") {
      const requesterId = String(req.user?.id ?? req.user?._id ?? "");
      if (!requesterId) return res.status(401).json({ error: "Unauthorized" });
      if (assignment.teacherId.toString() !== requesterId) {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    // Apply updates (keep it simple/explicit for key fields)
    const { title, description, due_date, max_score, status, courseId } = req.body;
    if (title !== undefined) assignment.title = String(title).trim();
    if (description !== undefined) assignment.description = description;
    if (due_date !== undefined) assignment.due_date = new Date(due_date);
    if (max_score !== undefined) assignment.max_score = max_score;
    if (status !== undefined) assignment.status = status;
    if (courseId !== undefined) assignment.courseId = courseId;

    await assignment.save();
    return res.json(assignment);
  } catch (err) {
    console.error("updateAssignment error", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    // Ownership check: only the teacher who created the assignment (or admin) can delete it
    if (req.user?.role !== "admin") {
      const requesterId = String(req.user?.id ?? req.user?._id ?? "");
      if (!requesterId) return res.status(401).json({ error: "Unauthorized" });
      if (assignment.teacherId.toString() !== requesterId) {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    await Assignment.findByIdAndDelete(req.params.id);
    // optionally delete submissions
    await Submission.deleteMany({ assignmentId: req.params.id });
    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteAssignment error", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};
