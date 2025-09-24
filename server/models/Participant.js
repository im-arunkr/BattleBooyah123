const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema for a single player within a team
const playerSchema = new Schema({
    inGameUsername: { 
        type: String, 
        required: [true, 'In-game username is required.'], 
        trim: true 
    },
    inGameUserId: { 
        type: String, 
        required: [true, 'In-game user ID is required.'], 
        trim: true 
    },
}, { _id: false }); // _id: false prevents Mongoose from creating an _id for subdocuments

const participantSchema = new Schema(
    {
        // Reference to the contest
        contestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contest',
            required: true,
            index: true, // Add index for faster queries on contestId
        },

        // Reference to the user who made the registration
        registeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // The type of entry
        teamType: {
            type: String,
            enum: ['Solo', 'Duo', 'Squad'],
            required: true,
        },

        // Team name (optional for Solo, required for Duo/Squad by controller)
        teamName: {
            type: String,
            trim: true,
        },

        // Unified array for ALL players (Solo will have 1, Duo 2, Squad 4)
        players: {
            type: [playerSchema],
            validate: [
                {
                    validator: function (playersArray) {
                        // Ensures the players array is not empty
                        return playersArray.length > 0;
                    },
                    message: 'At least one player is required.'
                }
            ]
        },
    },
    { timestamps: true }
);

// The old pre-validate hook has been removed as it is no longer needed.
// All validation logic is now handled in the controller.

module.exports = mongoose.model('Participant', participantSchema);