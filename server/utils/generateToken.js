import jwt from "jsonwebtoken";

const generateToken = (mentorId) => {
    return jwt.sign(
        { mentorId },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

export default generateToken;