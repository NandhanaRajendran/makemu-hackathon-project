import Team from "../models/Team.js";
import Mentor from "../models/Mentor.js";
import Assessment from "../models/Assessment.js";

const getStats = async (req, res) => {
    try {
        // Total teams
        const totalTeams = await Team.countDocuments();

        // Total participants
        const teams = await Team.find().select("members");

        const totalParticipants = teams.reduce(
            (total, team) => total + team.members.length,
            0
        );

        // Active mentors
        const activeMentors = await Mentor.countDocuments({
            isActive: true
        });

        // Total checkpoints
        const totalCheckpoints = 4;

        // Number of completed assessments
        const totalAssessments = await Assessment.countDocuments();

        res.status(200).json({
            totalTeams,
            totalParticipants,
            activeMentors,
            totalCheckpoints,
            totalAssessments
        });

    } catch (error) {
        console.error("Stats error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};

export { getStats };