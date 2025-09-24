const express = require('express');
const router = express.Router();

// Import all necessary functions from the controller
const { 
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
    getRegisteredPlayers // New endpoint
} = require('../controllers/adminController');

// Import the security middleware
const { protect, adminOnly } = require('../middleware/authMiddleware');

// === PUBLIC ADMIN ROUTES (No login required) ===
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// === PROTECTED ADMIN ROUTES (Must be a logged-in admin) ===

// --- User Management ---
router.post('/users', protect, adminOnly, createUser);
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

// --- Balance Management ---
router.post('/manage-balance', protect, adminOnly, manageBalance);

// --- Transaction Management ---
router.get('/transactions', protect, adminOnly, getTransactions);

// --- Contest Management ---
router.post('/contests', protect, adminOnly, createContest);
router.get('/contests', protect, adminOnly, getAllContests);
router.get('/contests/:id', protect, adminOnly, getContestById);
router.put('/contests/:id', protect, adminOnly, updateContest);
router.post('/contests/:id/leaderboard', protect, adminOnly, addLeaderboard);

// --- Fetch all registered players for a contest ---
router.get('/contests/:contestId/players', protect, adminOnly, getRegisteredPlayers);

module.exports = router;
