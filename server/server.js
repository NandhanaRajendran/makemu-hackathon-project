import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();


connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Makeμ Hackathon API is running 🚀"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});