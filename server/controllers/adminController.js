const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Contest = require('../models/Contest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// ... (registerAdmin, loginAdmin, createUser, and other functions remain the same) ...
// (रजिस्टर, लॉगिन, यूजर बनाने वाले और बाकी सारे फंक्शन वैसे के वैसे ही रहेंगे)

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public
const registerAdmin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Please provide all fields' });
    try {
        const userExists = await User.findOne({ username, role: 'admin' });
        if (userExists) return res.status(400).json({ message: 'Admin with this username already exists' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({
            username,
            password: hashedPassword,
            role: 'admin',
            userId: `admin_${username}`,
            mobileNumber: `0000000000_${Date.now()}`
        });

        if (user) {
            res.status(201).json({ message: "Admin registered successfully", token: generateToken(user._id) });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate/Login an admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && user.role === 'admin' && (await bcrypt.compare(password, user.password))) {
            res.json({ message: "Login successful", token: generateToken(user._id) });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new user by Admin
// @route   POST /api/admin/create-user
// @access  Private (Admin only)
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
            role: 'user'
        });

        res.status(201).json({ message: 'User created successfully!', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users with search functionality
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { role: 'user' };
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query = { ...query, $or: [{ userId: { $regex: searchRegex } }, { mobileNumber: { $regex: searchRegex } }] };
        }
        const users = await User.find(query).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
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

// @desc    Add or subtract points from a user's account
// @route   POST /api/admin/manage-balance
// @access  Private (Admin only)
const manageBalance = async (req, res) => {
    const { userId, points, action } = req.body;
    const numericPoints = parseFloat(points);

    if (!userId || !action || isNaN(numericPoints) || numericPoints <= 0) {
        return res.status(400).json({ message: 'UserID, action, and valid points are required' });
    }

    try {
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const currentPoints = parseFloat(user.points) || 0;
        let updateOperation;

        if (action === 'add') {
            updateOperation = { $inc: { points: numericPoints } };
        } else if (action === 'subtract') {
            if (currentPoints < numericPoints) {
                return res.status(400).json({ message: 'Withdrawal points exceed current points' });
            }
            updateOperation = { $inc: { points: -numericPoints } };
        } else {
            return res.status(400).json({ message: "Invalid action. Use 'add' or 'subtract'." });
        }

        const updatedUser = await User.findOneAndUpdate(
            { userId: userId },
            updateOperation,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found during update.' });
        }

        await Transaction.create({
            user: updatedUser._id,
            userIdString: updatedUser.userId,
            type: action === 'add' ? 'credit' : 'debit',
            amount: numericPoints,
            closingBalance: updatedUser.points,
            description: `Points ${action}ed by Admin`,
        });

        res.status(200).json({ 
            message: `Points updated successfully. New points: ${updatedUser.points}`,
            user: updatedUser 
        });

    } catch (error) {
        console.error("[ERROR] in manageBalance:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private (Admin only)
const getTransactions = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = { userIdString: search };
        }
        const transactions = await Transaction.find(query).sort({ createdAt: -1 }).limit(100);
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new contest
// @route   POST /api/admin/contests
// @access  Private (Admin only)
const createContest = async (req, res) => {
    try {
        const newContest = new Contest(req.body);
        const savedContest = await newContest.save();
        res.status(201).json({ message: 'Contest created successfully!', contest: savedContest });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Custom Contest ID already exists.' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all contests with advanced filtering
// @route   GET /api/admin/contests
// @access  Private (Admin only)
const getAllContests = async (req, res) => {
    try {
        const { statusFilter = 'Live', gameMode, teamType } = req.query; 
        let query = {};
        const now = new Date();
        
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

        if (statusFilter === 'Upcoming') {
            query.startTime = { $gt: now };
        } else if (statusFilter === 'Live') {
            query.startTime = { $lte: now, $gt: thirtyMinutesAgo };
        } else if (statusFilter === 'Finished') {
            query.startTime = { $lte: thirtyMinutesAgo };
        }

        if (gameMode && gameMode !== 'All') {
            query.gameMode = gameMode;
        }
        if (teamType && teamType !== 'All') {
            query.teamType = teamType;
        }
        
        const sortOrder = statusFilter === 'Upcoming' ? { startTime: 1 } : { startTime: -1 };
        
        const contests = await Contest.find(query).sort(sortOrder); 
        res.status(200).json(contests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get a single contest by its ID
// @route   GET /api/admin/contests/:id
// @access  Private (Admin only)
const getContestById = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id)
            .populate('players', 'userId points');
        if (!contest) return res.status(404).json({ message: 'Contest not found' });
        res.status(200).json(contest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// [NEW & IMPROVED] Update any contest detail
// @desc    Update a contest's details
// @route   PUT /api/admin/contests/:id
// @access  Private (Admin only)
const updateContest = async (req, res) => {
    try {
        const updatedContest = await Contest.findByIdAndUpdate(
            req.params.id,
            req.body, // Frontend se bheje gaye saare data ko update karega
            {
                new: true, // Hamesha updated document return karega
                runValidators: true // Schema me diye gaye rules ko check karega
            }
        );

        if (!updatedContest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        res.status(200).json({ message: 'Contest updated successfully!', contest: updatedContest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add leaderboard results to a contest
// @route   POST /api/admin/contests/:id/leaderboard
// @access  Private (Admin only)
const addLeaderboard = async (req, res) => {
    const { leaderboardData } = req.body;
    try {
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

module.exports = {
    registerAdmin,
    loginAdmin,
    createUser,
    getAllUsers,
    deleteUser,
    manageBalance,
    getTransactions,
    createContest,
    getAllContests,
    getContestById,
    updateContest, // [MODIFIED] Replaced updateRoomDetails
    addLeaderboard,
};