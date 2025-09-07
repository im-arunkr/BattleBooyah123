const express = require('express');
const router = express.Router();

// Sabhi zaroori functions ko controller se import karein
const { 
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
    updateContest,     // [MODIFIED] updateRoomDetails ki jagah
    addLeaderboard
} = require('../controllers/adminController');

// Authentication middleware ko import karein
const { protect } = require('../middleware/authMiddleware');

// === PUBLIC ROUTES (Bina login ke access ho sakte hain) ===
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// === PROTECTED ADMIN ROUTES (Sirf logged-in admin inko access kar sakta hai) ===

// --- User Management ---
router.post('/create-user', protect, createUser);
router.get('/users', protect, getAllUsers);
router.delete('/users/:id', protect, deleteUser);

// --- Balance Management ---
router.post('/manage-balance', protect, manageBalance);

// --- Transaction Management ---
router.get('/transactions', protect, getTransactions);

// --- Contest Management ---
router.post('/contests', protect, createContest);
router.get('/contests', protect, getAllContests);
router.get('/contests/:id', protect, getContestById);
router.put('/contests/:id', protect, updateContest); // [MODIFIED] General contest update route
router.post('/contests/:id/leaderboard', protect, addLeaderboard); // Leaderboard add karne ke liye

module.exports = router;