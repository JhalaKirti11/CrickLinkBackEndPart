import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    matchId: {
        type: String,
        required: true,
        unique: true
    },
    tournamentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tournament"
    },
    team1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    team2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    date: {
        type: Date,
        required: true
    },
    venue: {
        type: String,
        required: true,
        trim: true,
    },
    result: {
        winnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
        },
        score: {
            type: Number,
            trim: true,
        }
    }
},{ timestamps: true });

export const Match = mongoose.model("match", matchSchema);



