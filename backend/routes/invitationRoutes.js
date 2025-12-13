const express = require('express');
const router = express.Router();
const { sendInvitation, getMyInvitations, getProjectInvitations, deleteInvitation, respondToInvitation } = require('../controllers/invitationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendInvitation);
router.get('/', protect, getMyInvitations);
router.get('/project/:projectId', protect, getProjectInvitations);
router.delete('/:id', protect, deleteInvitation);
router.put('/:id/respond', protect, respondToInvitation);

module.exports = router;
