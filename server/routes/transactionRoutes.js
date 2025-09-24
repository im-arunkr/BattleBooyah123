const express = require('express');
const router = express.Router();
const { getMyTransactions } = require('../controllers/transactionController');
const { protectUser } = require('../middleware/userMiddleware');

// This route is protected. Only a logged-in user can access it.
router.get('/me', protectUser, getMyTransactions);

module.exports = router;