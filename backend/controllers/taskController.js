const Task = require('../models/taskModel');
const Project = require('../models/projectModel');

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
        assignedTo: req.body.assignedTo || req.user.id,
        duration: req.body.duration,
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

// @desc    Get tasks assigned to current user
// @route   GET /api/tasks/my-tasks
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user.id })
            .populate('project', 'name')
            .populate('assignedTo', 'name email');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit task (upload proof)
// @route   PUT /api/tasks/:id/submit
// @access  Private
const submitTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        if (task.assignedTo.toString() !== req.user.id) {
            res.status(401);
            throw new Error('Not authorized to submit this task');
        }

        task.status = 'Pending Review'; // Or 'Done' based on workflow
        task.proofUrl = req.body.proofUrl || task.proofUrl;

        // If a file link or description is provided
        task.submissionNotes = req.body.submissionNotes || task.submissionNotes;

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get tasks pending review for projects managed by current user
// @route   GET /api/tasks/manager-review
// @access  Private
const getManagerTasks = async (req, res) => {
    try {
        // Find projects where user is manager or creator
        const projects = await Project.find({
            $or: [{ manager: req.user.id }, { createdBy: req.user.id }]
        });
        const projectIds = projects.map(p => p._id);

        // Find tasks in those projects with status 'Pending Review'
        const tasks = await Task.find({
            project: { $in: projectIds },
            status: 'Pending Review'
        })
            .populate('project', 'name')
            .populate('assignedTo', 'name email');

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update task (e.g., status)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Auth check: User must be assigned or project manager? 
        // For simplicity, allowed if assignedTo matches or creator.
        if (task.assignedTo.toString() !== req.user.id && req.user.id !== task.project?.createdBy?.toString()) {
            res.status(401);
            throw new Error('Not authorized');
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    getMyTasks,
    getManagerTasks,
    submitTask,
    updateTask,
};
