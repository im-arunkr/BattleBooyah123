const express = require('express');
const router = express.Router();

const { 
    loginUser, 
    getLoggedInUser, 
    changePassword 
} = require('../controllers/userController');

// UPDATED: Now imports from the single, correct authMiddleware file
const { protect } = require('../middleware/authMiddleware');

// Public Route
router.post('/login', loginUser);

// Protected Routes (now using the new 'protect' function)
router.get('/me', protect, getLoggedInUser);
router.post('/change-password', protect, changePassword);

module.exports = router;