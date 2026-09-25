import express from "express";

import {
    createAssessment,
    getAssessmentsByCheckpoint,
    getAssessmentsByTeam,
    getMyCheckpointAssessments,
    updateAssessment
} from "../controllers/assessmentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/", protect, createAssessment);

router.get(
    "/checkpoint/:checkpoint",
    protect,
    getAssessmentsByCheckpoint
);

router.get(
    "/team/:teamId",
    protect,
    getAssessmentsByTeam
);

router.get(
    "/my/checkpoint/:checkpoint",
    protect,
    getMyCheckpointAssessments
);

router.put(
    "/:assessmentId",
    protect,
    updateAssessment
);

export default router;