// server/routes/preparationResources.js
import express from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import * as ctrl from "../controllers/preparationResourcesController.js";

const router = express.Router();

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", authenticate, requireAdmin, ctrl.create);
router.put("/:id", authenticate, requireAdmin, ctrl.update);
router.delete("/:id", authenticate, requireAdmin, ctrl.remove);

export default router;
