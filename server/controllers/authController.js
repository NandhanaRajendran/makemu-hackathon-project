import bcrypt from "bcryptjs";
import Mentor from "../models/Mentor.js";
import generateToken from "../utils/generateToken.js";

const loginMentor = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check whether username and password were provided
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required."
            });
        }

        // Find mentor
        const mentor = await Mentor.findOne({ username });

        if (!mentor) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        // Check active status
        if (!mentor.isActive) {
            return res.status(403).json({
                message: "Your mentor account is inactive."
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            mentor.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        // Generate JWT
        const token = generateToken(mentor._id);

        res.status(200).json({
            message: "Login successful.",
            token,
            mentor: {
                id: mentor._id,
                username: mentor.username,
                name: mentor.name
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};

export { loginMentor };