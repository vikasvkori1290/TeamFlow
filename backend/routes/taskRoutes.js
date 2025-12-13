const express = require('express');
const router = express.Router();
const { createTask, getTasks, getMyTasks, submitTask, updateTask, getManagerTasks } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTask);
router.get('/my-tasks', protect, getMyTasks);
router.get('/manager-review', protect, getManagerTasks);
router.put('/:id/submit', protect, submitTask);
router.put('/:id', protect, updateTask);
router.get('/:projectId', protect, getTasks);

module.exports = router;
