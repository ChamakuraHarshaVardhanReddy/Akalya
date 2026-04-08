// server/routes/submissions.js
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Submission from '../models/Submission.js';

const router = express.Router();

/**
 * GET /api/submissions
 * - If the requester is teacher/admin -> return all submissions (optionally paginated)
 * - Otherwise (student) -> return student's own submissions
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    // determine user role (adjust field names depending on your auth middleware)
    const role = user.role || user.roles || user.userRole || 'student';
    const isTeacherOrAdmin = ['teacher', 'admin'].includes(String(role).toLowerCase());

    let query = {};
    if (!isTeacherOrAdmin) {
      const studentId = String(user._id ?? user.id ?? user.userId ?? '');
      query = {
        $or: [{ student_id: studentId }, { studentId: studentId }, { student: studentId }],
      };
    }

    // try to populate 'assignment' only if it is referenced in schema
    let subs;
    try {
      const schemaPath = Submission.schema?.path('assignment');
      if (schemaPath && schemaPath.options && schemaPath.options.ref) {
        subs = await Submission.find(query).populate('assignment').sort({ createdAt: -1 }).lean();
      } else {
        subs = await Submission.find(query).sort({ createdAt: -1 }).lean();
      }
    } catch (popErr) {
      console.warn('[GET /api/submissions] populate failed, returning raw submissions', popErr);
      subs = await Submission.find(query).sort({ createdAt: -1 }).lean();
    }

    return res.json(Array.isArray(subs) ? subs : []);
  } catch (err) {
    console.error('[GET /api/submissions] error:', err);
    return res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

/**
 * GET /api/submissions/me
 * - Existing route: fetch current user's submissions
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const studentId = String(user._id ?? user.id ?? user.userId ?? '');
    const query = {
      $or: [{ student_id: studentId }, { studentId: studentId }, { student: studentId }],
    };

    let subs;
    try {
      const schemaPath = Submission.schema?.path('assignment');
      if (schemaPath && schemaPath.options && schemaPath.options.ref) {
        subs = await Submission.find(query).populate('assignment').sort({ createdAt: -1 }).lean();
      } else {
        subs = await Submission.find(query).sort({ createdAt: -1 }).lean();
      }
    } catch (popErr) {
      console.warn('[GET /api/submissions/me] populate failed, returning raw submissions', popErr);
      subs = await Submission.find(query).sort({ createdAt: -1 }).lean();
    }

    return res.json(Array.isArray(subs) ? subs : []);
  } catch (err) {
    console.error('[GET /api/submissions/me] error:', err);
    return res.status(500).json({ error: 'Failed to fetch your submissions' });
  }
});

/**
 * POST /api/submissions
 * - Create submission (requires auth)
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Authentication required' });

    const { assignmentId, submissionText, submissionFileUrl } = req.body || {};

    const studentId = String(user._id ?? user.id ?? user.userId ?? '');

    const newSub = new Submission({
      assignmentId: assignmentId ?? null,
      submissionText: submissionText ?? '',
      submissionFileUrl: submissionFileUrl ?? null,
      studentId, // and/or student_id depending on your schema
      createdAt: new Date(),
    });

    const saved = await newSub.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error('[POST /api/submissions] error:', err);
    return res.status(500).json({ error: 'Failed to create submission' });
  }
});

/**
 * PUT /api/submissions/:id/grade
 * Teacher/Admin grades a submission. Body: { grade, feedback }
 */
router.put('/:id/grade', authenticate, async (req, res) => {
  try {
    const role = req.user?.role || 'student';
    if (!['teacher', 'admin'].includes(role)) return res.status(403).json({ error: 'Forbidden' });
    const { grade, feedback } = req.body || {};
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: 'Submission not found' });
    if (typeof grade === 'number') sub.grade = grade;
    if (feedback !== undefined) sub.feedback = feedback;
    sub.gradedAt = new Date();
    await sub.save();
    return res.json(sub);
  } catch (err) {
    console.error('[PUT /api/submissions/:id/grade] error:', err);
    return res.status(500).json({ error: 'Failed to grade submission' });
  }
});

export default router;
