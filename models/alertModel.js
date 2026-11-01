
const db = require('../config/db');
const logAction = require('./auditLogHelper');

const getAllAlerts = async () => {
    const [rows] = await db.query(`
        SELECT
            a.*,
            sa.area_name
        FROM alerts a
        JOIN study_areas sa
            ON a.study_area_id = sa.study_area_id
        ORDER BY a.created_at DESC
    `);

    return rows;
};

const getAlertById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM alerts WHERE alert_id = ?',
        [id]
    );

    return rows[0];
};

const createAlert = async (data) => {
    const { study_area_id, threshold_id, severity, message } = data;

    const [result] = await db.query(
        `INSERT INTO alerts
        (study_area_id, threshold_id, severity, message, status)
        VALUES (?, ?, ?, ?, 'Open')`,
        [study_area_id, threshold_id || null, severity, message]
    );

    await logAction(
        null,
        'CREATE',
        'alerts',
        result.insertId,
        'Manually created an alert.'
    );

    return result.insertId;
};

const updateAlertStatus = async (id, status) => {
    const [result] = await db.query(
        'UPDATE alerts SET status = ? WHERE alert_id = ?',
        [status, id]
    );

    if (result.affectedRows > 0) {
        await logAction(
            null,
            'UPDATE',
            'alerts',
            id,
            `Updated alert status to ${status}.`
        );
    }

    return result.affectedRows;
};

const deleteAlert = async (id) => {
    const [result] = await db.query(
        'DELETE FROM alerts WHERE alert_id = ?',
        [id]
    );

    if (result.affectedRows > 0) {
        await logAction(
            null,
            'DELETE',
            'alerts',
            id,
            'Manually deleted an alert.'
        );
    }

    return result.affectedRows;
};

module.exports = {
    getAllAlerts,
    getAlertById,
    createAlert,
    updateAlertStatus,
    deleteAlert
};
