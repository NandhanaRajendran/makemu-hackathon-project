import express from "express";

import {
    createTeam,
    getTeams,
    getTeamById
} from "../controllers/teamController.js";

const router = express.Router();

router.post("/", createTeam);

router.get("/", getTeams);

router.get("/:teamId", getTeamById);

export default router;