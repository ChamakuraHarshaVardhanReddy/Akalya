// server/routes/practice.js
import express from "express";
import { authenticate, requireAdmin, requireStudent } from "../middleware/auth.js";
import * as ctrl from "../controllers/practiceController.js";

const router = express.Router();

router.get("/questions", ctrl.getQuestions);
router.post("/submit", authenticate, requireStudent, ctrl.submitPractice);
router.get("/explanation/:id", ctrl.getExplanation);
router.get("/history", authenticate, requireStudent, ctrl.getMyHistory);

router.get("/admin/questions", authenticate, requireAdmin, ctrl.adminGetQuestions);
router.post("/admin/questions", authenticate, requireAdmin, ctrl.adminCreateQuestion);
router.put("/admin/questions/:id", authenticate, requireAdmin, ctrl.adminUpdateQuestion);
router.delete("/admin/questions/:id", authenticate, requireAdmin, ctrl.adminDeleteQuestion);

export default router;
