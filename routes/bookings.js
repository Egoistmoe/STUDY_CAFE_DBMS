const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET ALL BOOKINGS
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT b.*, s.seat_label, a.area_name
            FROM bookings b
            INNER JOIN seats s ON s.seat_id = b.seat_id
            INNER JOIN study_areas a ON a.study_area_id = s.study_area_id
            ORDER BY b.booking_id DESC
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD BOOKING
router.post('/', async (req, res) => {
    try {
        const { user_id, seat_id, start_time, end_time, status } = req.body;

        const [result] = await db.query(
            `INSERT INTO bookings 
            (user_id, seat_id, start_time, end_time, status)
            VALUES (?, ?, ?, ?, ?)`,
            [user_id, seat_id, start_time, end_time, status]
        );

        res.json({
            message: 'Booking added successfully',
            booking_id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE BOOKING
router.put('/:id', async (req, res) => {
    try {
        const { user_id, seat_id, start_time, end_time, status } = req.body;

        await db.query(
            `UPDATE bookings
            SET user_id = ?, seat_id = ?, start_time = ?, 
                end_time = ?, status = ?
            WHERE booking_id = ?`,
            [user_id, seat_id, start_time, end_time, status, req.params.id]
        );

        res.json({ message: 'Booking updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE BOOKING
router.delete('/:id', async (req, res) => {
    try {
        await db.query(
            'DELETE FROM bookings WHERE booking_id = ?',
            [req.params.id]
        );

        res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;