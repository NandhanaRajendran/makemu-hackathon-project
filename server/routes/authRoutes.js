import express from "express";
import { loginMentor } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginMentor);

export default router;