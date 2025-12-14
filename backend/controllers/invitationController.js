const Invitation = require('../models/invitationModel');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

// @desc    Send an invitation
// @route   POST /api/invitations
// @access  Private
const sendInvitation = async (req, res) => {
    const { recipientEmail, projectId, skill } = req.body;

    if (!recipientEmail || !projectId || !skill) {
        res.status(400).json({ message: 'Please add all fields (email, project, skill)' });
        return;
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
    }

    // Check if invitation already exists
    const invitationExists = await Invitation.findOne({
        recipientEmail,
        project: projectId,
        status: 'pending',
    });

    if (invitationExists) {
        res.status(400).json({ message: 'Invitation already sent' });
        return;
    }

    const invitation = await Invitation.create({
        sender: req.user.id,
        recipientEmail,
        project: projectId,
        skill,
    });

    // Notify Recipient if they exist in the system
    const recipientUser = await User.findOne({ email: recipientEmail });

    if (recipientUser) {
        await Notification.create({
            recipient: recipientUser._id,
            type: 'project_invite',
            message: `You have been invited to join "${project.name}" as a ${skill}`,
            link: invitation._id.toString() // Store invitation ID to handle acceptance
        });
    }

    res.status(201).json(invitation);
};

// @desc    Get my invitations
// @route   GET /api/invitations
// @access  Private
const getMyInvitations = async (req, res) => {
    const invitations = await Invitation.find({
        recipientEmail: req.user.email,
        status: 'pending',
    }).populate('project', 'name').populate('sender', 'name');

};

// @desc    Get invitations for a specific project
// @route   GET /api/invitations/project/:projectId
// @access  Private
const getProjectInvitations = async (req, res) => {
    try {
        const invitations = await Invitation.find({
            project: req.params.projectId,
            status: 'pending',
        }).populate('sender', 'name'); // Recipient email is usually just string

        res.status(200).json(invitations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete/Cancel an invitation
// @route   DELETE /api/invitations/:id
// @access  Private
const deleteInvitation = async (req, res) => {
    try {
        const invitation = await Invitation.findById(req.params.id);

        if (!invitation) {
            res.status(404);
            throw new Error('Invitation not found');
        }

        // Check auth: Sender can cancel, Recipient can ignore? 
        // For 'Manage Project' context, likely the project manager (sender) cancelling.
        if (invitation.sender.toString() !== req.user.id) {
            // Ideally also allow project manager if different from sender, checking Project model
            // Keeping simple for now: Sender or Recipient
            const project = await Project.findById(invitation.project);
            if (project && project.manager.toString() !== req.user.id) {
                res.status(401);
                throw new Error('Not authorized');
            }
        }

        await invitation.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get my invitations

// @desc    Respond to invitation
// @route   PUT /api/invitations/:id/respond
// @access  Private
const respondToInvitation = async (req, res) => {
    const { status } = req.body; // 'accepted' or 'rejected'
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
        res.status(404).json({ message: 'Invitation not found' });
        return;
    }

    // Verify the recipient matches the logged-in user
    if (invitation.recipientEmail !== req.user.email) {
        res.status(401).json({ message: 'Not authorized' });
        return;
    }

    invitation.status = status;
    await invitation.save();

    if (status === 'accepted') {
        // Add user to project members
        const project = await Project.findById(invitation.project);
        if (project) {
            if (!project.members.includes(req.user.id)) {
                project.members.push(req.user.id);
                await project.save();
            }
        }
    }

    res.status(200).json(invitation);
};

module.exports = {
    sendInvitation,
    getMyInvitations,
    getProjectInvitations,
    deleteInvitation,
    respondToInvitation,
};
