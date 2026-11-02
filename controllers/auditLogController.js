const auditLogModel = require('../models/auditLogModel');

const getAllAuditLogs = async (req, res) => {
    try {
        const logs = await auditLogModel.getAllAuditLogs();

        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching audit logs:', error);

        res.status(500).json({
            message: 'Failed to retrieve audit logs.',
            error: error.message
        });
    }
};

module.exports = {
    getAllAuditLogs
};