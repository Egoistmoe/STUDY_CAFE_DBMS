const studyAreaModel = require('../models/studyAreaModel');

// GET all study areas
exports.getAllStudyAreas = async (req, res) => {
    try {
        const areas = await studyAreaModel.getAllStudyAreas();
        res.status(200).json(areas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET study area by ID
exports.getStudyAreaById = async (req, res) => {
    try {
        const area = await studyAreaModel.getStudyAreaById(req.params.id);

        if (!area) {
            return res.status(404).json({ message: 'Study area not found' });
        }

        res.status(200).json(area);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE study area
exports.createStudyArea = async (req, res) => {
    try {
        const id = await studyAreaModel.createStudyArea(req.body);
        res.status(201).json({
            message: 'Study area created successfully',
            study_area_id: id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE study area
exports.updateStudyArea = async (req, res) => {
    try {
        const updated = await studyAreaModel.updateStudyArea(
            req.params.id,
            req.body
        );

        if (!updated) {
            return res.status(404).json({ message: 'Study area not found' });
        }

        res.status(200).json({ message: 'Study area updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE study area
exports.deleteStudyArea = async (req, res) => {
    try {
        const deleted = await studyAreaModel.deleteStudyArea(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Study area not found' });
        }

        res.status(200).json({ message: 'Study area deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};