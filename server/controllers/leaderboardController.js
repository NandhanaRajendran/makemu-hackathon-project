import Team from "../models/Team.js";
import Assessment from "../models/Assessment.js";
import Mentor from "../models/Mentor.js";

const getLeaderboard = async (req, res) => {
    try {
        // Get all teams
        const teams = await Team.find()
            .select("teamName tagline members");

        // Get active mentors
        const activeMentors = await Mentor.find({
            isActive: true
        }).select("_id");

        const activeMentorIds = activeMentors.map(
            (mentor) => mentor._id.toString()
        );

        const leaderboard = [];

        for (const team of teams) {

            const assessments = await Assessment.find({
                team: team._id,
                mentor: { $in: activeMentorIds }
            });

            const checkpointScores = {
                1: null,
                2: null,
                3: null,
                4: null
            };

            // Calculate average for each checkpoint
            for (const checkpoint of [1, 2, 3, 4]) {

                const checkpointAssessments = assessments.filter(
                    (assessment) =>
                        assessment.checkpoint === checkpoint
                );

                if (checkpointAssessments.length > 0) {

                    const total = checkpointAssessments.reduce(
                        (sum, assessment) =>
                            sum + assessment.score,
                        0
                    );

                    checkpointScores[checkpoint] =
                        total / checkpointAssessments.length;
                }
            }

            // Calculate total score
            const completedCheckpoints = Object.values(
                checkpointScores
            ).filter(
                (score) => score !== null
            );

            const totalScore = completedCheckpoints.reduce(
                (sum, score) => sum + score,
                0
            );

            leaderboard.push({
                teamId: team._id,
                teamName: team.teamName,
                checkpoint1: checkpointScores[1],
                checkpoint2: checkpointScores[2],
                checkpoint3: checkpointScores[3],
                checkpoint4: checkpointScores[4],
                total: totalScore
            });
        }

        // Sort highest total first
        leaderboard.sort(
            (a, b) => b.total - a.total
        );

        // Add rank
        leaderboard.forEach((team, index) => {
            team.rank = index + 1;
        });

        res.status(200).json({
            count: leaderboard.length,
            leaderboard
        });

    } catch (error) {
        console.error("Leaderboard error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};

export { getLeaderboard };