const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gameMode: {
        type: String,
        required: true,
        enum: ['Clash Squad', 'Lone Wolf'],
    },
}, {
    timestamps: true,
});

// Yeh rule ensure karega ki ek user ek game mode ke liye sirf ek baar vote kar sake
voteSchema.index({ user: 1, gameMode: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
