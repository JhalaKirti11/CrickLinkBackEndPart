import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  TournamentName: {
    type: String,
    required: true,
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  teams: [
    {
      teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
      }
    }
  ],
  schedule: [
    {
      matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'match',
      },
    }
  ],
  // venue:{
  //   type: String,
  //   required: true,
  //   default: null
  // },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  entry_fees :{
    type: Number,
    default: 0
  },
  status:{
    type: String,
    enum: ["active","inactive"],
    default: "active"
  }
});

const Tournament = mongoose.model('Tournament', tournamentSchema);

export default Tournament;