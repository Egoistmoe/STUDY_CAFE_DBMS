const db = require('../config/db');

const getAllAuditLogs = async () => {
    const [rows] = await db.query(`
        SELECT
            al.audit_log_id,
            al.user_id,
            COALESCE(u.full_name, 'System') AS performed_by,
            al.action,
            al.table_name,
            al.record_id,
            al.details,
            al.created_at
        FROM audit_logs al
        LEFT JOIN users u
            ON al.user_id = u.user_id
        ORDER BY al.created_at DESC
    `);

    return rows;
};

module.exports = {
    getAllAuditLogs
};