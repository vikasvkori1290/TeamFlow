const express = require('express');
const router = express.Router();
const { generateToken, debugEnv } = require('../controllers/agoraController');
const { protect } = require('../middleware/authMiddleware');

router.get('/token', protect, generateToken);
router.get('/debug', protect, debugEnv);

module.exports = router;
