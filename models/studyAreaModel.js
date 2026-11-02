const db = require('../config/db');

// GET ALL STUDY AREAS
const getAllStudyAreas = async () => {
    const [rows] = await db.query(
        'SELECT * FROM study_areas'
    );
    return rows;
};

// GET STUDY AREA BY ID
const getStudyAreaById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM study_areas WHERE study_area_id = ?',
        [id]
    );
    return rows[0];
};

// CREATE STUDY AREA
const createStudyArea = async (data) => {
    const [result] = await db.query(
        `INSERT INTO study_areas
        (branch_id, area_name, area_type, hourly_rate, max_hours, description)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            data.branch_id,
            data.area_name,
            data.area_type,
            data.hourly_rate,
            data.max_hours,
            data.description
        ]
    );

    return result.insertId;
};

// UPDATE STUDY AREA
const updateStudyArea = async (id, data) => {
    const [result] = await db.query(
        `UPDATE study_areas
        SET branch_id = ?, area_name = ?, area_type = ?,
            hourly_rate = ?, max_hours = ?, description = ?
        WHERE study_area_id = ?`,
        [
            data.branch_id,
            data.area_name,
            data.area_type,
            data.hourly_rate,
            data.max_hours,
            data.description,
            id
        ]
    );

    return result.affectedRows;
};

// DELETE STUDY AREA
const deleteStudyArea = async (id) => {
    const [result] = await db.query(
        'DELETE FROM study_areas WHERE study_area_id = ?',
        [id]
    );

    return result.affectedRows;
};

module.exports = {
    getAllStudyAreas,
    getStudyAreaById,
    createStudyArea,
    updateStudyArea,
    deleteStudyArea
};