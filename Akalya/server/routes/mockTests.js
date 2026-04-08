// server/routes/mockTests.js
import express from "express";
import { authenticate, requireAdmin, requireStudent } from "../middleware/auth.js";
import * as ctrl from "../controllers/mockTestsController.js";

const router = express.Router();

router.get("/", ctrl.getAll);
router.get("/my/attempts", authenticate, requireStudent, ctrl.getMyAttempts);
router.get("/:id", ctrl.getById);
router.post("/submit", authenticate, requireStudent, ctrl.submitTest);

router.post("/admin", authenticate, requireAdmin, ctrl.adminCreate);
router.put("/admin/:id", authenticate, requireAdmin, ctrl.adminUpdate);
router.post("/admin/questions", authenticate, requireAdmin, ctrl.adminAddQuestion);
router.delete("/admin/:id", authenticate, requireAdmin, ctrl.adminDeleteTest);

export default router;
