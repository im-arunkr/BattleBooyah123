const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    gameTitle: {
        type: String,
        required: true,
        trim: true,
    },
    gameMode: {
        type: String,
        required: true,
        enum: ['Battle Royale', 'Clash Squad', 'Lone Wolf'],
    },
    teamType: {
        type: String,
        required: true,
        enum: ['Solo', 'Duo', 'Squad', '4v4', '1v1', '2v2'],
    },
    viewType: {
        type: String,
        required: true,
        enum: ['TPP', 'FPP'],
    },
    map: {
        type: String,
        required: true,
    },
    entryFee: {
        type: Number,
        required: true,
    },
    totalPrize: {
        type: Number,
        required: true,
    },
    perKillReward: {
        type: Number,
        default: 0,
    },
    startTime: {
        type: Date,
        required: true,
    },
    totalParticipants: {
        type: Number,
        required: true,
    },
    prizeBreakup: {
        type: String,
    },
    bonusUsable: {
        type: String, // Jaise "10%"
    },
    customContestId: {
        type: String,
        unique: true,
        sparse: true,
    },
    status: {
        type: String,
        default: 'Upcoming',
        enum: ['Upcoming', 'Live', 'Finished', 'Cancelled'],
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    roomDetails: {
        roomId: { type: String, default: null },
        password: { type: String, default: null },
    },
    // [MODIFIED] Leaderboard structure updated for consistency
    leaderboard: [
        {
            rank: { type: Number, required: true },
            userId: { type: String, required: true }, // Changed from UserId to userId
            gameUsername: { type: String, required: true },
            kills: { type: Number, default: 0 },
            prize: { type: Number, default: 0 }
        }
    ]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Contest', contestSchema);

