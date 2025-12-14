const Project = require('../models/projectModel');
const User = require('../models/userModel');
const Task = require('../models/taskModel');

// @desc    Get user projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [{ manager: req.user.id }, { members: req.user.id }, { createdBy: req.user.id }]
        })
            .populate('manager', 'name email avatar')
            .populate('members', 'name email avatar');

        // Aggregate task stats for each project
        const projectsWithStats = await Promise.all(projects.map(async (project) => {
            const totalTasks = await Task.countDocuments({ project: project._id });
            const completedTasks = await Task.countDocuments({ project: project._id, status: 'Done' });
            const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

            return {
                ...project.toObject(),
                totalTasks,
                completedTasks,
                progress
            };
        }));

        res.status(200).json(projectsWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('manager', 'name email avatar')
            .populate('members', 'name email avatar');

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Authorization: Check if user is manager or member or creator
        if (
            project.manager._id.toString() !== req.user.id &&
            !project.members.some(m => m._id.toString() === req.user.id) &&
            project.createdBy?.toString() !== req.user.id
        ) {
            res.status(401);
            throw new Error('Not authorized to view this project');
        }

        // Get stats
        const totalTasks = await Task.countDocuments({ project: project._id });
        const completedTasks = await Task.countDocuments({ project: project._id, status: 'Done' });
        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        res.status(200).json({
            ...project.toObject(),
            totalTasks,
            completedTasks,
            progress
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    try {
        const { name, description, startDate, endDate, color, members, manager } = req.body;

        if (!name) {
            res.status(400);
            throw new Error('Please add a project name');
        }

        // Default manager to creator if not set
        const projectManager = manager ? manager._id : req.user.id;

        // Ensure members is an array of IDs
        let memberIds = [];
        if (members && Array.isArray(members)) {
            memberIds = members.map(m => m._id || m); // Handle if full objects passed
        }

        // Add manager to members
        if (!memberIds.includes(projectManager)) {
            memberIds.push(projectManager);
        }

        const project = await Project.create({
            name,
            description,
            startDate,
            endDate,
            color,
            manager: projectManager,
            members: memberIds,
            createdBy: req.user.id
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        // Authorization check
        if (project.manager.toString() !== req.user.id && !project.members.includes(req.user.id)) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        const isManager = project.manager && project.manager.toString() === req.user.id;
        const isCreator = project.createdBy && project.createdBy.toString() === req.user.id;

        if (!isManager && !isCreator) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await project.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
};
