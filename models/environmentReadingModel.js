
const db = require('../config/db');
const checkReading = require('./alertEngineModel');
const logAction = require('./auditLogHelper');

const getAllReadings = async () => {
    const [rows] = await db.query(`
        SELECT er.*, sa.area_name
        FROM environment_readings er
        JOIN study_areas sa
        ON er.study_area_id = sa.study_area_id
        ORDER BY er.recorded_at DESC
    `);

    return rows;
};

const getReadingById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM environment_readings WHERE reading_id = ?',
        [id]
    );

    return rows[0];
};

const createReading = async (data) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const {
            study_area_id,
            metric_name,
            reading_value
        } = data;

        const [result] = await connection.query(
            `INSERT INTO environment_readings
            (study_area_id, metric_name, reading_value)
            VALUES (?, ?, ?)`,
            [study_area_id, metric_name, reading_value]
        );

        await checkReading(connection, result.insertId);

        await connection.query(
            `INSERT INTO audit_logs
            (user_id, action, table_name, record_id, details)
            VALUES (?, ?, ?, ?, ?)`,
            [
                null,
                'CREATE',
                'environment_readings',
                result.insertId,
                'Manually created an environment reading.'
            ]
        );

        await connection.commit();

        return result.insertId;

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const updateReading = async (id, data) => {
    const { study_area_id, metric_name, reading_value } = data;

    const [result] = await db.query(
        `UPDATE environment_readings
        SET study_area_id = ?, metric_name = ?, reading_value = ?
        WHERE reading_id = ?`,
        [study_area_id, metric_name, reading_value, id]
    );

    if (result.affectedRows > 0) {
        await logAction(
            null,
            'UPDATE',
            'environment_readings',
            id,
            'Updated an environment reading.'
        );
    }

    return result.affectedRows;
};

const deleteReading = async (id) => {
    const [result] = await db.query(
        'DELETE FROM environment_readings WHERE reading_id = ?',
        [id]
    );

    if (result.affectedRows > 0) {
        await logAction(
            null,
            'DELETE',
            'environment_readings',
            id,
            'Deleted an environment reading.'
        );
    }

    return result.affectedRows;
};

module.exports = {
    getAllReadings,
    getReadingById,
    createReading,
    updateReading,
    deleteReading
};
