const db = require('../config/db');

// GET ALL SEATS
const getAllSeats = async () => {
    const [rows] = await db.query(`
        SELECT s.*, a.area_name
        FROM seats s
        INNER JOIN study_areas a
            ON s.study_area_id = a.study_area_id
    `);

    return rows;
};

// GET SEAT BY ID
const getSeatById = async (id) => {
    const [rows] = await db.query(
        `SELECT s.*, a.area_name
         FROM seats s
         INNER JOIN study_areas a
            ON s.study_area_id = a.study_area_id
         WHERE s.seat_id = ?`,
        [id]
    );

    return rows[0];
};

// CREATE SEAT
const createSeat = async (data) => {
    const [result] = await db.query(
        `INSERT INTO seats (study_area_id, seat_label, status)
         VALUES (?, ?, ?)`,
        [data.study_area_id, data.seat_label, data.status || 'Available']
    );

    return result.insertId;
};

// UPDATE SEAT
const updateSeat = async (id, data) => {
    const [result] = await db.query(
        `UPDATE seats
         SET study_area_id = ?, seat_label = ?, status = ?
         WHERE seat_id = ?`,
        [data.study_area_id, data.seat_label, data.status, id]
    );

    return result.affectedRows;
};

// DELETE SEAT
const deleteSeat = async (id) => {
    const [result] = await db.query(
        'DELETE FROM seats WHERE seat_id = ?',
        [id]
    );

    return result.affectedRows;
};

// GET SEATS WITHOUT ACTIVE BOOKINGS
const getSeatsWithoutActiveBookings = async () => {
    const [rows] = await db.query(`
        SELECT s.seat_id, s.seat_label, s.status, a.area_name
        FROM seats s
        INNER JOIN study_areas a
            ON s.study_area_id = a.study_area_id
        LEFT JOIN bookings b
            ON s.seat_id = b.seat_id
            AND b.status IN ('Confirmed', 'Checked-In')
        WHERE b.booking_id IS NULL
    `);

    return rows;
};

module.exports = {
    getAllSeats,
    getSeatById,
    createSeat,
    updateSeat,
    deleteSeat,
    getSeatsWithoutActiveBookings
};