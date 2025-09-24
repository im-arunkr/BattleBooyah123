const crypto = require('crypto'); // For generating secure random tokens
const Admin = require('../models/Admin');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Contest = require('../models/Contest');
const Participant = require('../models/Participant'); // Added for contest participants
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendPasswordResetEmail } = require('../utils/emailService'); // For sending emails

// Helper function to generate a consistent JWT
const generateToken = (id) => {
    const payload = { user: { id: id } };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// --- ADMIN AUTHENTICATION --- //

const registerAdmin = async (req, res) => {
    const { username, password, email, mobileNumber } = req.body;
    if (!username || !password || !email || !mobileNumber) {
        return res.status(400).json({ message: 'Username, password, email, and mobile number are required.' });
    }
    try {
        const adminExists = await Admin.findOne({ $or: [{ username }, { email }] });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin with this username or email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const admin = await Admin.create({
            username,
            email,
            mobileNumber,
            password: hashedPassword,
        });
        if (admin) {
            res.status(201).json({ 
                _id: admin._id,
                username: admin.username,
                token: generateToken(admin._id) 
            });
        } else {
            res.status(400).json({ message: 'Invalid admin data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (admin && (await bcrypt.compare(password, admin.password))) {
            res.json({
                _id: admin._id,
                username: admin.username,
                token: generateToken(admin._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const forgotPassword = async (req, res) => {
    const { emailOrMobile } = req.body;
    try {
        const admin = await Admin.findOne({ 
            $or: [{ email: emailOrMobile }, { mobileNumber: emailOrMobile }] 
        });
        if (admin) {
            const resetToken = crypto.randomBytes(32).toString('hex');
            admin.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            admin.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
            await admin.save();
            const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/reset-password/${resetToken}`;
            sendPasswordResetEmail(admin.email, resetUrl);
        }
        res.status(200).json({ message: 'If an account exists, a reset link has been sent.' });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(200).json({ message: 'If an account exists, a reset link has been sent.' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const resetToken = req.params.token;
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const admin = await Admin.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });
        if (!admin) {
            return res.status(400).json({ message: 'Password reset link is invalid or has expired.' });
        }
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(req.body.password, salt);
        admin.passwordResetToken = undefined;
        admin.passwordResetExpires = undefined;
        await admin.save();
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- USER MANAGEMENT --- //

const createUser = async (req, res) => {
    const { userId, mobileNumber, password, points } = req.body;
    if (!userId || !mobileNumber || !password) {
        return res.status(400).json({ message: 'UserID, Mobile Number, and Password are required' });
    }
    try {
        const userExists = await User.findOne({ $or: [{ userId }, { mobileNumber }] });
        if (userExists) {
            let errorMessage = userExists.userId === userId ? 'UserID already exists.' : 'Mobile Number is already registered.';
            return res.status(400).json({ message: errorMessage });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            userId,
            mobileNumber,
            password: hashedPassword,
            points: points || 0,
        });
        res.status(201).json({ message: 'User created successfully!', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query = { $or: [{ userId: { $regex: searchRegex } }, { mobileNumber: { $regex: searchRegex } }] };
        }
        const users = await User.find(query).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.deleteOne();
        res.status(200).json({ message: 'User removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const manageBalance = async (req, res) => {
    const { userId, points, action } = req.body;
    const numericPoints = parseFloat(points);
    if (!userId || !action || isNaN(numericPoints) || numericPoints <= 0) {
        return res.status(400).json({ message: 'UserID, action, and valid points are required' });
    }
    try {
        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const currentPoints = parseFloat(user.points) || 0;
        if (action === 'subtract' && currentPoints < numericPoints) {
            return res.status(400).json({ message: 'Withdrawal points exceed current points' });
        }
        const updateOperation = { $inc: { points: action === 'add' ? numericPoints : -numericPoints } };
        const updatedUser = await User.findOneAndUpdate({ userId }, updateOperation, { new: true }).select('-password');
        await Transaction.create({
            user: updatedUser._id,
            userIdString: updatedUser.userId,
            type: action === 'add' ? 'credit' : 'debit',
            amount: numericPoints,
            closingBalance: updatedUser.points,
            description: `Points ${action}ed by Admin`,
        });
        res.status(200).json({ message: `Points updated successfully. New balance: ${updatedUser.points}`, user: updatedUser });
    } catch (error) {
        console.error("[ERROR] in manageBalance:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- TRANSACTION MANAGEMENT --- //

const getTransactions = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) query = { userIdString: search };
        const transactions = await Transaction.find(query).sort({ createdAt: -1 }).limit(100);
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- CONTEST MANAGEMENT --- //

const createContest = async (req, res) => {
    try {
        const newContest = new Contest(req.body);
        const savedContest = await newContest.save();
        res.status(201).json({ message: 'Contest created successfully!', contest: savedContest });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) return res.status(400).json({ message: 'Custom Contest ID already exists.' });
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all contests with players
const getAllContests = async (req, res) => {
    try {
        const { statusFilter = 'Live', gameMode, teamType } = req.query;
        let query = {};
        const now = new Date();
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

        if (statusFilter === 'Upcoming') query.startTime = { $gt: now };
        else if (statusFilter === 'Live') query.startTime = { $lte: now, $gt: thirtyMinutesAgo };
        else if (statusFilter === 'Finished') query.startTime = { $lte: thirtyMinutesAgo };

        if (gameMode && gameMode !== 'All') query.gameMode = gameMode;
        if (teamType && teamType !== 'All') query.teamType = teamType;

        const sortOrder = statusFilter === 'Upcoming' ? { startTime: 1 } : { startTime: -1 };
        const contests = await Contest.find(query).sort(sortOrder);

        const contestsWithPlayers = await Promise.all(
            contests.map(async (contest) => {
                const participants = await Participant.find({ contestId: contest._id });
                return { ...contest.toObject(), players: participants.flatMap(p => p.players) };
            })
        );

        res.status(200).json(contestsWithPlayers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get contest by ID with players
const getContestById = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);
        if (!contest) return res.status(404).json({ message: 'Contest not found' });

        // Use contest._id for participant query
        const participants = await Participant.find({ contestId: contest._id })
            .populate('registeredBy', 'username') // fetch only username
            .lean();

        const playersList = participants.flatMap(p =>
            p.players.map(pl => ({
                websiteUserId: p.registeredBy?.username || p.registeredBy?._id,
                inGameUsername: pl.inGameUsername,
                inGameUserId: pl.inGameUserId
            }))
        );

        // Send contest details along with players
        res.status(200).json({ ...contest.toObject(), players: playersList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Fetch all registered players for a contest (new endpoint)
const getRegisteredPlayers = async (req, res) => {
    try {
        const { contestId } = req.params;

        // Fetch participants with correct field
        const participants = await Participant.find({ contestId })
            .populate('registeredBy', 'userId _id') // Use 'userId' instead of 'username'
            .lean();

        // Map all players
        const playersList = participants.flatMap(p =>
            p.players.map(pl => ({
                websiteUserId: p.registeredBy?.userId || p.registeredBy?._id, // Correct field here
                inGameUsername: pl.inGameUsername,
                inGameUserId: pl.inGameUserId
            }))
        );

        res.status(200).json({ players: playersList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch registered players' });
    }
};

const updateContest = async (req, res) => {
    try {
        const updatedContest = await Contest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedContest) return res.status(404).json({ message: 'Contest not found' });
        res.status(200).json({ message: 'Contest updated successfully!', contest: updatedContest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const addLeaderboard = async (req, res) => {
    try {
        const { leaderboardData } = req.body;
        const contest = await Contest.findById(req.params.id);
        if (!contest) return res.status(404).json({ message: 'Contest not found' });
        contest.leaderboard = leaderboardData;
        const updatedContest = await contest.save();
        res.status(200).json(updatedContest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Export all controller functions
module.exports = {
    registerAdmin,
    loginAdmin,
    forgotPassword,
    resetPassword,
    createUser,
    getAllUsers,
    deleteUser,
    manageBalance,
    getTransactions,
    createContest,
    getAllContests,
    getContestById,
    updateContest,
    addLeaderboard,
    getRegisteredPlayers, // New
};
