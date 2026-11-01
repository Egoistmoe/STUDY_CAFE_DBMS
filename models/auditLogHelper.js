const db = require('../config/db');

const logAction = async (
    userId,
    action,
    tableName,
    recordId,
    details
) => {
    try {
        const [result] = await db.query(
            `INSERT INTO audit_logs
            (user_id, action, table_name, record_id, details)
            VALUES (?, ?, ?, ?, ?)`,
            [
                userId || null,
                action,
                tableName,
                recordId || null,
                details || null
            ]
        );

        console.log('Audit log saved:', result.insertId);

    } catch (error) {
        console.error('Audit log error:', error.message);
        throw error;
    }
};

module.exports = logAction;