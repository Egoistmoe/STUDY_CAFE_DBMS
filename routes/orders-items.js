const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET ALL ORDER ITEMS
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT oi.*
            FROM order_items oi
            INNER JOIN orders o ON o.order_id = oi.order_id
            ORDER BY oi.order_item_id DESC`
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD ORDER ITEM
router.post('/', async (req, res) => {
    try {
        const { order_id, menu_item_id, quantity, subtotal } = req.body;

        const [result] = await db.query(
            `INSERT INTO order_items
            (order_id, menu_item_id, quantity, subtotal)
            VALUES (?, ?, ?, ?)`,
            [order_id, menu_item_id, quantity, subtotal]
        );

        res.json({
            message: 'Order item added successfully',
            order_item_id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE ORDER ITEM
router.put('/:id', async (req, res) => {
    try {
        const { order_id, menu_item_id, quantity, subtotal } = req.body;

        await db.query(
            `UPDATE order_items
            SET order_id = ?, menu_item_id = ?, 
                quantity = ?, subtotal = ?
            WHERE order_item_id = ?`,
            [order_id, menu_item_id, quantity, subtotal, req.params.id]
        );

        res.json({ message: 'Order item updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE ORDER ITEM
router.delete('/:id', async (req, res) => {
    try {
        await db.query(
            'DELETE FROM order_items WHERE order_item_id = ?',
            [req.params.id]
        );

        res.json({ message: 'Order item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;