const Task = require('../models/taskModel');

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    if (!req.body.title || !req.body.project) {
        res.status(400).json({ message: 'Please add a task title and project ID' });
        return;
    }

    const task = await Task.create({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        project: req.body.project,
        assignedTo: req.user.id, // Default assignment to creator, can be changed
    });

    res.status(200).json(task);
};

// @desc    Get tasks for a project
// @route   GET /api/tasks/:projectId
// @access  Private
const getTasks = async (req, res) => {
    const tasks = await Task.find({ project: req.params.projectId });

    res.status(200).json(tasks);
};

module.exports = {
    createTask,
    getTasks,
};
