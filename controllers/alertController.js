
const Alert = require('../models/alertModel');

const getAllAlerts = async (req, res) => {
    try {
        const alerts = await Alert.getAllAlerts();
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAlertById = async (req, res) => {
    try {
        const alert = await Alert.getAlertById(req.params.id);

        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        res.status(200).json(alert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createAlert = async (req, res) => {
    try {
        const {
            study_area_id,
            threshold_id,
            severity,
            message
        } = req.body;

        if (!study_area_id || !severity || !message) {
            return res.status(400).json({
                message: 'Study area, severity, and message are required'
            });
        }

        if (!['Low', 'Medium', 'High'].includes(severity)) {
            return res.status(400).json({
                message: 'Invalid severity'
            });
        }

        const alertId = await Alert.createAlert({
            study_area_id,
            threshold_id,
            severity,
            message
        });

        res.status(201).json({
            message: 'Alert created successfully',
            alert_id: alertId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAlertStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Open', 'Acknowledged', 'Resolved'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid alert status'
            });
        }

        const updated = await Alert.updateAlertStatus(
            req.params.id,
            status
        );

        if (!updated) {
            return res.status(404).json({
                message: 'Alert not found'
            });
        }

        res.status(200).json({
            message: 'Alert status updated successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAlert = async (req, res) => {
    try {
        const deleted = await Alert.deleteAlert(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: 'Alert not found'
            });
        }

        res.status(200).json({
            message: 'Alert deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllAlerts,
    getAlertById,
    createAlert,
    updateAlertStatus,
    deleteAlert
};
