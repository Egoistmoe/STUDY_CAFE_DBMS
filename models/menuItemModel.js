const db = require('../config/db');

// GET ALL MENU ITEMS
const getAllMenuItems = async () => {
    const [rows] = await db.query(
        'SELECT * FROM menu_items'
    );
    return rows;
};

// GET MENU ITEM BY ID
const getMenuItemById = async (id) => {
    const [rows] = await db.query(
        'SELECT * FROM menu_items WHERE menu_item_id = ?',
        [id]
    );
    return rows[0];
};

// CREATE MENU ITEM
const createMenuItem = async (data) => {
    const [result] = await db.query(
        `INSERT INTO menu_items
        (branch_id, item_name, category, price, stock_quantity, reorder_level, is_available)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            data.branch_id,
            data.item_name,
            data.category,
            data.price,
            data.stock_quantity ?? 0,
            data.reorder_level ?? 5,
            data.is_available ?? true
        ]
    );

    return result.insertId;
};

// UPDATE MENU ITEM
const updateMenuItem = async (id, data) => {
    const [result] = await db.query(
        `UPDATE menu_items
         SET branch_id = ?, item_name = ?, category = ?,
             price = ?, stock_quantity = ?, reorder_level = ?,
             is_available = ?
         WHERE menu_item_id = ?`,
        [
            data.branch_id,
            data.item_name,
            data.category,
            data.price,
            data.stock_quantity,
            data.reorder_level,
            data.is_available,
            id
        ]
    );

    return result.affectedRows;
};

// DELETE MENU ITEM
const deleteMenuItem = async (id) => {
    const [result] = await db.query(
        'DELETE FROM menu_items WHERE menu_item_id = ?',
        [id]
    );

    return result.affectedRows;
};

module.exports = {
    getAllMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
};