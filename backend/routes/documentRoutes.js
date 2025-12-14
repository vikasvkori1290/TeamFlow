const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { uploadDocument, getDocuments } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:projectId', protect, upload.single('file'), uploadDocument);
router.get('/:projectId', protect, getDocuments);

module.exports = router;
