const express = require('express');
const router = express.Router();
const { getVoteStatus, castVote } = require('../controllers/voteController');
const { protectUser } = require('../middleware/userMiddleware'); // Assuming this is your user protection middleware

// Yeh route :gameMode parameter (jaise "Clash Squad") ke saath aane wali
// GET aur POST, dono requests ko handle karega.

// GET request vote ka status laayega.
// POST request naya vote cast karega.
router.route('/:gameMode')
    .get(protectUser, getVoteStatus)
    .post(protectUser, castVote);

module.exports = router;

