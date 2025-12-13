const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a project name'],
        },
        description: {
            type: String,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        color: {
            type: String,
            default: '#2E7D32',
        },
        status: {
            type: String,
            enum: ['Planning', 'Active', 'On Hold', 'Completed'],
            default: 'Planning',
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Project', projectSchema);
