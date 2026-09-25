import jwt from "jsonwebtoken";
import Mentor from "../models/Mentor.js";

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized. Token required."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const mentor = await Mentor.findById(decoded.mentorId)
            .select("-password");

        if (!mentor || !mentor.isActive) {
            return res.status(401).json({
                message: "Not authorized."
            });
        }

        req.mentor = mentor;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

export default protect;