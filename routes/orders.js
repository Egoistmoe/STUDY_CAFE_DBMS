const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET ALL ORDERS
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM orders ORDER BY order_id DESC'
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD ORDER
router.post('/', async (req, res) => {
    try {
        const { booking_id, user_id, total_amount, status } = req.body;

        const [result] = await db.query(
            `INSERT INTO orders 
            (booking_id, user_id, total_amount, status)
            VALUES (?, ?, ?, ?)`,
            [booking_id, user_id, total_amount, status]
        );

        res.json({
            message: 'Order added successfully',
            order_id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE ORDER
router.put('/:id', async (req, res) => {
    try {
        const { booking_id, user_id, total_amount, status } = req.body;

        await db.query(
            `UPDATE orders
            SET booking_id = ?, user_id = ?, 
                total_amount = ?, status = ?
            WHERE order_id = ?`,
            [booking_id, user_id, total_amount, status, req.params.id]
        );

        res.json({ message: 'Order updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE ORDER
router.delete('/:id', async (req, res) => {
    try {
        await db.query(
            'DELETE FROM orders WHERE order_id = ?',
            [req.params.id]
        );

        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;