import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
    {
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true
        },

        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mentor",
            required: true
        },

        checkpoint: {
            type: Number,
            required: true,
            enum: [1, 2, 3, 4]
        },

        score: {
            type: Number,
            required: true,
            min: 0,
            max: 25
        },

        remarks: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

// One assessment for each team + checkpoint + mentor
assessmentSchema.index(
    { team: 1, checkpoint: 1, mentor: 1 },
    { unique: true }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;