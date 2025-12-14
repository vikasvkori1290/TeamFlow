const mongoose = require('mongoose');

const invitationSchema = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        recipientEmail: {
            type: String,
            required: [true, 'Please add a recipient email'],
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Project',
        },
        skill: {
            type: String,
            required: [true, 'Please specify a skill/role'],
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Invitation', invitationSchema);
