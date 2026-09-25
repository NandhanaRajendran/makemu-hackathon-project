import Team from "../models/Team.js";

// Add a new team
const createTeam = async (req, res) => {
    try {
        const { teamName, tagline, members } = req.body;

        if (!teamName || !members) {
            return res.status(400).json({
                message: "Team name and members are required."
            });
        }

        // Check number of members
        if (!Array.isArray(members) || members.length < 2 || members.length > 3) {
            return res.status(400).json({
                message: "A team must have exactly 2 or 3 members."
            });
        }

        // Check exactly one team lead
        const teamLeads = members.filter(
            (member) => member.isTeamLead === true
        );

        if (teamLeads.length !== 1) {
            return res.status(400).json({
                message: "A team must have exactly one team lead."
            });
        }

        // Check duplicate team name
        const existingTeam = await Team.findOne({ teamName });

        if (existingTeam) {
            return res.status(409).json({
                message: "A team with this name already exists."
            });
        }

        const team = await Team.create({
            teamName,
            tagline,
            members
        });

        res.status(201).json({
            message: "Team created successfully.",
            team
        });

    } catch (error) {
        console.error("Create team error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};


// Get all teams
const getTeams = async (req, res) => {
    try {
        const teams = await Team.find()
            .sort({ teamName: 1 });

        res.status(200).json({
            count: teams.length,
            teams
        });

    } catch (error) {
        console.error("Get teams error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};


// Get a single team
const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);

        if (!team) {
            return res.status(404).json({
                message: "Team not found."
            });
        }

        res.status(200).json({
            team
        });

    } catch (error) {
        console.error("Get team error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};


export {
    createTeam,
    getTeams,
    getTeamById
};