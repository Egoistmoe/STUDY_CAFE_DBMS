
const Reading = require('../models/environmentReadingModel');

const getAllReadings = async (req, res) => {
    try {
        const readings = await Reading.getAllReadings();
        res.status(200).json(readings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReadingById = async (req, res) => {
    try {
        const reading = await Reading.getReadingById(req.params.id);

        if (!reading) {
            return res.status(404).json({ message: 'Reading not found' });
        }

        res.status(200).json(reading);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createReading = async (req, res) => {
    try {
        const { study_area_id, metric_name, reading_value } = req.body;

        if (!study_area_id || !metric_name || reading_value === undefined || reading_value === '') {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!Number.isFinite(Number(reading_value))) {
            return res.status(400).json({ message: 'Reading value must be numeric' });
        }

        const readingId = await Reading.createReading({
            study_area_id,
            metric_name,
            reading_value
        });

        res.status(201).json({
            message: 'Reading created successfully',
            reading_id: readingId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReading = async (req, res) => {
    try {
        const { study_area_id, metric_name, reading_value } = req.body;

        if (!study_area_id || !metric_name || reading_value === undefined || reading_value === '') {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!Number.isFinite(Number(reading_value))) {
            return res.status(400).json({ message: 'Reading value must be numeric' });
        }

        const updated = await Reading.updateReading(req.params.id, {
            study_area_id,
            metric_name,
            reading_value
        });

        if (!updated) {
            return res.status(404).json({ message: 'Reading not found' });
        }

        res.status(200).json({ message: 'Reading updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReading = async (req, res) => {
    try {
        const deleted = await Reading.deleteReading(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Reading not found' });
        }

        res.status(200).json({ message: 'Reading deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllReadings,
    getReadingById,
    createReading,
    updateReading,
    deleteReading
};
