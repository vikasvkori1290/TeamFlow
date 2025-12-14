const Document = require('../models/documentModel');

// @desc    Upload a document
// @route   POST /api/documents/:projectId
// @access  Private
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { projectId } = req.params;

        // Create DB entry
        const doc = await Document.create({
            project: projectId,
            name: req.file.originalname,
            url: req.file.path,
            fileType: req.file.mimetype,
            uploadedBy: req.user._id,
        });

        res.status(201).json(doc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all documents for a project
// @route   GET /api/documents/:projectId
// @access  Private
const getDocuments = async (req, res) => {
    try {
        const { projectId } = req.params;
        const docs = await Document.find({ project: projectId }).populate('uploadedBy', 'name email');
        res.json(docs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { uploadDocument, getDocuments };
