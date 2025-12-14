const express = require('express');
const router = express.Router();
const { generateToken } = require('../controllers/agoraController');
const { protect } = require('../middleware/authMiddleware');

router.get('/token', protect, generateToken);

module.exports = router;
