const express = require('express');
const router = express.Router();

// (1) getMyContests ko yahan import karein
const {
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
    getLeaderboard  // <-- Yeh import zaroori hai
} = require('../controllers/contestController');

const { protectUser, protectAdmin } = require('../middleware/userMiddleware');


// --- User Routes ---
router.get('/battle-royale', protectUser, getBattleRoyaleContests);

// (2) Specific route '/my-contests' ko dynamic route '/:id' se pehle rakhein
router.get('/my-contests', protectUser, getMyContests);


router.get('/:id/leaderboard', protectUser, getLeaderboard);

router.post('/:id/check-participants', protectUser, checkParticipants);
router.post('/:id/join', protectUser, joinContest);
router.get('/:id/participants/public', protectUser, getContestParticipantsPublic);


// --- Admin Routes ---
router.post('/', protectAdmin, createContest);
router.get('/:id/participants', protectAdmin, getContestParticipants);


// --- Mixed Routes (Dynamic route hamesha aakhir mein aayega) ---
router.route('/:id')
    .get(protectUser, getContestById)
    .put(protectAdmin, updateContest)
    .delete(protectAdmin, deleteContest);

module.exports = router;
