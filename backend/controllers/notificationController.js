const Notification = require('../models/notificationModel');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user.id })
        .sort({ createdAt: -1 })
        .limit(20);

    res.status(200).json(notifications);
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404).json({ message: 'Notification not found' });
        return;
    }

    // Check user
    if (notification.recipient.toString() !== req.user.id) {
        res.status(401).json({ message: 'Not authorized' });
        return;
    }

    notification.read = true;
    await notification.save();

    res.status(200).json(notification);
};

module.exports = {
    getNotifications,
    markAsRead,
};
