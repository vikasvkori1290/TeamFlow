const express = require('express');
const router = express.Router();
const { getProjects, getProject, createProject, updateProject, deleteProject, notifyTeam, removeMember } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProjects).post(protect, createProject);
router.route('/:id').get(protect, getProject).put(protect, updateProject).delete(protect, deleteProject);
router.put('/:id/remove-member', protect, removeMember);
router.post('/:id/notify', protect, notifyTeam);

module.exports = router;
