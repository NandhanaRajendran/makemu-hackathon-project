import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        isTeamLead: {
            type: Boolean,
            default: false
        }
    },
    {
        _id: false
    }
);

const teamSchema = new mongoose.Schema(
    {
        teamName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        tagline: {
            type: String,
            trim: true,
            default: ""
        },

        members: {
            type: [memberSchema],
            required: true,
            validate: {
                validator: function (members) {
                    return members.length >= 2 && members.length <= 3;
                },
                message: "A team must have exactly 2 or 3 members."
            }
        }
    },
    {
        timestamps: true
    }
);

// Exactly one team lead
teamSchema.pre("validate", function () {
    const teamLeads = this.members.filter(
        (member) => member.isTeamLead === true
    );

    if (teamLeads.length !== 1) {
        throw new Error(
            "A team must have exactly one team lead."
        );
    }
});

const Team = mongoose.model("Team", teamSchema);

export default Team;