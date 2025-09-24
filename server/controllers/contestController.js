const mongoose = require('mongoose');
const Contest = require('../models/Contest');
const User = require('../models/User');
const Participant = require('../models/Participant');
const asyncHandler = require('express-async-handler');

// --- USER-FACING FUNCTIONS ---

// Get upcoming Battle Royale contests
const getBattleRoyaleContests = asyncHandler(async (req, res) => {
    const contests = await Contest.find({
        gameMode: 'Battle Royale',
        startTime: { $gt: new Date() }
    }).sort({ startTime: 1 });
    res.status(200).json(contests);
});

// Get single contest details
const getContestById = asyncHandler(async (req, res) => {
    const contest = await Contest.findById(req.params.id).populate({
        path: 'players',
        populate: {
            path: 'registeredBy',
            select: 'username'
        }
    });

    if (!contest) {
        res.status(404);
        throw new Error('Contest not found');
    }
    res.status(200).json(contest);
});

// Check if some in-game IDs are already registered
const checkParticipants = asyncHandler(async (req, res) => {
    const { userIds } = req.body;
    const contestId = req.params.id;

    if (!userIds || !Array.isArray(userIds)) {
        res.status(400);
        throw new Error('User IDs are required.');
    }

    const existingParticipants = await Participant.find({
        contestId: contestId,
        "players.inGameUserId": { $in: userIds }
    });

    const existingIds = existingParticipants.flatMap(p =>
        p.players
            .filter(player => userIds.includes(player.inGameUserId))
            .map(player => player.inGameUserId)
    );
    res.status(200).json({ existingIds });
});

// Join a contest (supports solo/duo/squad)
const joinContest = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const contestId = req.params.id;
        const userId = req.user.id;
        const { players, teamName } = req.body;

        if (!players || !Array.isArray(players) || players.length === 0) {
            res.status(400);
            throw new Error('Player details are required.');
        }

        const contest = await Contest.findById(contestId).session(session);
        const user = await User.findById(userId).session(session);

        if (!contest) { res.status(404); throw new Error('Contest not found'); }
        if (contest.startTime <= new Date()) { res.status(400); throw new Error('Contest has already started.'); }
        if (contest.players.length >= contest.totalParticipants) { res.status(400); throw new Error('Contest is full.'); }
        if (user.points < contest.entryFee) { res.status(400); throw new Error('Insufficient points.'); }

        const playerIds = players.map(p => p.inGameUserId);
        const duplicatePlayers = await Participant.findOne({
            contestId: contestId,
            "players.inGameUserId": { $in: playerIds }
        }).session(session);

        if (duplicatePlayers) {
            res.status(400);
            throw new Error('One or more player IDs are already registered.');
        }

        const participantData = {
            contestId,
            registeredBy: userId,
            teamType: contest.teamType,
            players: players.map(player => ({
                inGameUsername: player.inGameUsername,
                inGameUserId: player.inGameUserId
            }))
        };
        
        if (contest.teamType !== "Solo") {
            if (!teamName || !teamName.trim()) {
                res.status(400);
                throw new Error(`${contest.teamType} mode requires a team name.`);
            }
            participantData.teamName = teamName;
        }

        const newParticipant = new Participant(participantData);
        await newParticipant.save({ session });

        user.points -= contest.entryFee;
        await user.save({ session });

        contest.players.push(newParticipant._id);
        await contest.save({ session });

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: 'Successfully joined the contest!' });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

// ✅ GET ALL CONTESTS JOINED BY THE USER
const getMyContests = asyncHandler(async (req, res) => {
    const userParticipations = await Participant.find({ registeredBy: req.user._id });

    if (!userParticipations || userParticipations.length === 0) {
        return res.status(200).json([]);
    }

    const contestIds = userParticipations.map(p => p.contestId);
    const contests = await Contest.find({ '_id': { $in: contestIds } }).sort({ startTime: -1 });
    res.status(200).json(contests);
});


// --- ADMIN-ONLY FUNCTIONS ---

const createContest = asyncHandler(async (req, res) => {
    const newContest = new Contest(req.body);
    const savedContest = await newContest.save();
    res.status(201).json(savedContest);
});

const updateContest = asyncHandler(async (req, res) => {
    const updatedContest = await Contest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedContest) { res.status(404); throw new Error('Contest not found'); }
    res.status(200).json(updatedContest);
});

const deleteContest = asyncHandler(async (req, res) => {
    const contest = await Contest.findByIdAndDelete(req.params.id);
    if (!contest) { res.status(404); throw new Error('Contest not found'); }
    await Participant.deleteMany({ contestId: req.params.id });
    res.status(200).json({ message: 'Contest and participants deleted.' });
});

const getContestParticipants = asyncHandler(async (req, res) => {
    const participants = await Participant.find({ contestId: req.params.id })
        .populate('registeredBy', 'username mobileNumber')
        .sort({ createdAt: 1 });
    if (!participants || participants.length === 0) { res.status(404); throw new Error('No participants found'); }
    res.status(200).json(participants);
});

const getContestParticipantsPublic = asyncHandler(async (req, res) => {
    const participants = await Participant.find({ contestId: req.params.id })
        .populate('registeredBy', 'username')
        .sort({ createdAt: 1 });
    if (!participants || participants.length === 0) { return res.status(200).json([]); }
    res.status(200).json(participants);
});

// --- [YEH NAYA FUNCTION ADD KAREIN] ---
/**
 * @desc    Get the final leaderboard for a contest
 * @route   GET /api/contests/:id/leaderboard
 * @access  Private (User)
 */
const getLeaderboard = asyncHandler(async (req, res) => {
    const contest = await Contest.findById(req.params.id)
        .select('gameTitle leaderboard'); // Sirf zaroori data select karein

    if (!contest) {
        res.status(404);
        throw new Error('Contest not found.');
    }

    if (!contest.leaderboard || contest.leaderboard.length === 0) {
        res.status(404);
        throw new Error('Leaderboard for this contest has not been published yet.');
    }

    // Frontend ki zaroorat ke hisaab se data format karein
    res.status(200).json({
        contestTitle: contest.gameTitle,
        results: contest.leaderboard
    });
});


// --- [MODULE.EXPORTS KO UPDATE KAREIN] ---
module.exports = {
    getBattleRoyaleContests,
    getContestById,
    checkParticipants,
    joinContest,
    createContest,
    updateContest,
    deleteContest,
    getContestParticipants,
    getContestParticipantsPublic,
    getMyContests,
    getLeaderboard // <-- Ise yahan add karein
};