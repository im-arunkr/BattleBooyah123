const Vote = require('../models/Vote');

// @desc    Get vote status for a specific game mode
// @route   GET /api/votes/:gameMode
// @access  Private (User must be logged in)
const getVoteStatus = async (req, res) => {
    try {
        const { gameMode } = req.params;
        const userId = req.user.id;

        // Get the total number of votes for this game mode
        const totalVotes = await Vote.countDocuments({ gameMode });

        // Check if the currently logged-in user has already voted
        const userVote = await Vote.findOne({ user: userId, gameMode });

        res.status(200).json({
            totalVotes,
            hasVoted: !!userVote, // Will be true if vote exists, false otherwise
        });
    } catch (error) {
        console.error("Error getting vote status:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Cast a vote for a game mode
// @route   POST /api/votes/:gameMode
// @access  Private (User must be logged in)
const castVote = async (req, res) => {
    try {
        const { gameMode } = req.params;
        const userId = req.user.id;

        // Double-check on the server to prevent multiple votes
        const existingVote = await Vote.findOne({ user: userId, gameMode });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already cast your vote.' });
        }

        // Create the new vote record
        await Vote.create({
            user: userId,
            gameMode: gameMode,
        });

        // Get the new total count after adding the vote
        const totalVotes = await Vote.countDocuments({ gameMode });

        res.status(201).json({ 
            message: 'Thank you for your vote!',
            totalVotes,
            hasVoted: true
        });

    } catch (error) {
        console.error("Error casting vote:", error);
        // This handles the rare case where two votes are sent at the exact same time
        if (error.code === 11000) { 
             return res.status(400).json({ message: 'You have already cast your vote.' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getVoteStatus,
    castVote,
};