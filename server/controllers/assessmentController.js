import Assessment from "../models/Assessment.js";
import Team from "../models/Team.js";


// Create mentor's assessment
const createAssessment = async (req, res) => {
    try {
        const { teamId, checkpoint, score, remarks } = req.body;

        // Validate required fields
        if (!teamId || checkpoint === undefined || score === undefined) {
            return res.status(400).json({
                message: "Team, checkpoint and score are required."
            });
        }

        // Validate checkpoint
        if (![1, 2, 3, 4].includes(Number(checkpoint))) {
            return res.status(400).json({
                message: "Checkpoint must be between 1 and 4."
            });
        }

        // Validate score
        if (Number(score) < 0 || Number(score) > 25) {
            return res.status(400).json({
                message: "Score must be between 0 and 25."
            });
        }

        // Check team exists
        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({
                message: "Team not found."
            });
        }

        // Mentor comes from JWT middleware
        const assessment = await Assessment.create({
            team: teamId,
            mentor: req.mentor._id,
            checkpoint: Number(checkpoint),
            score: Number(score),
            remarks: remarks || ""
        });

        res.status(201).json({
            message: "Assessment submitted successfully.",
            assessment
        });

    } catch (error) {
        console.error("Create assessment error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};


// Get all assessments for a checkpoint
const getAssessmentsByCheckpoint = async (req, res) => {
    try {
        const checkpoint = Number(req.params.checkpoint);

        if (![1, 2, 3, 4].includes(checkpoint)) {
            return res.status(400).json({
                message: "Checkpoint must be between 1 and 4."
            });
        }

        const assessments = await Assessment.find({ checkpoint })
            .populate("team", "teamName")
            .populate("mentor", "name username")
            .sort({ createdAt: -1 });

        res.status(200).json({
            checkpoint,
            count: assessments.length,
            assessments
        });

    } catch (error) {
        console.error("Get checkpoint assessments error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};


// Get all assessments for a team
const getAssessmentsByTeam = async (req, res) => {
    try {
        const assessments = await Assessment.find({
            team: req.params.teamId
        })
            .populate("mentor", "name username")
            .sort({ checkpoint: 1, createdAt: 1 });

        res.status(200).json({
            teamId: req.params.teamId,
            count: assessments.length,
            assessments
        });

    } catch (error) {
        console.error("Get team assessments error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};

// Get all teams with the logged-in mentor's assessment
const getMyCheckpointAssessments = async (req, res) => {
    try {
        const checkpoint = Number(req.params.checkpoint);

        if (![1, 2, 3, 4].includes(checkpoint)) {
            return res.status(400).json({
                message: "Checkpoint must be between 1 and 4."
            });
        }

        const teams = await Team.find()
            .select("teamName tagline members")
            .sort({ teamName: 1 });

        const mentorId = req.mentor._id;

        const assessments = await Assessment.find({
            mentor: mentorId,
            checkpoint
        });

        const assessmentMap = new Map();

        assessments.forEach((assessment) => {
            assessmentMap.set(
                assessment.team.toString(),
                assessment
            );
        });

        const result = teams.map((team) => {
            const assessment = assessmentMap.get(
                team._id.toString()
            );

            return {
                teamId: team._id,
                teamName: team.teamName,
                tagline: team.tagline,
                members: team.members,
                score: assessment ? assessment.score : null,
                remarks: assessment ? assessment.remarks : "",
                assessmentId: assessment
                    ? assessment._id
                    : null
            };
        });

        res.status(200).json({
            checkpoint,
            teams: result
        });

    } catch (error) {
        console.error(
            "Get my checkpoint assessments error:",
            error
        );

        res.status(500).json({
            message: "Server error."
        });
    }
};
const updateAssessment = async (req, res) => {
    try {
        const { score, remarks } = req.body;

        if (score === undefined) {
            return res.status(400).json({
                message: "Score is required."
            });
        }

        if (Number(score) < 0 || Number(score) > 25) {
            return res.status(400).json({
                message: "Score must be between 0 and 25."
            });
        }

        const assessment = await Assessment.findById(
            req.params.assessmentId
        );

        if (!assessment) {
            return res.status(404).json({
                message: "Assessment not found."
            });
        }

        // A mentor can edit only their own assessment
        if (
            assessment.mentor.toString() !==
            req.mentor._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only edit your own assessment."
            });
        }

        assessment.score = Number(score);
        assessment.remarks = remarks || "";

        await assessment.save();

        res.status(200).json({
            message: "Assessment updated successfully.",
            assessment
        });

    } catch (error) {
        console.error("Update assessment error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};

export {
    createAssessment,
    getAssessmentsByCheckpoint,
    getAssessmentsByTeam,
    getMyCheckpointAssessments,
    updateAssessment
};