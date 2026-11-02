const menuItemModel = require('../models/menuItemModel');

// GET ALL MENU ITEMS
exports.getAllMenuItems = async (req, res) => {
    try {
        const items = await menuItemModel.getAllMenuItems();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET MENU ITEM BY ID
exports.getMenuItemById = async (req, res) => {
    try {
        const item = await menuItemModel.getMenuItemById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE MENU ITEM
exports.createMenuItem = async (req, res) => {
    try {
        const id = await menuItemModel.createMenuItem(req.body);

        res.status(201).json({
            message: 'Menu item created successfully',
            menu_item_id: id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE MENU ITEM
exports.updateMenuItem = async (req, res) => {
    try {
        const updated = await menuItemModel.updateMenuItem(
            req.params.id,
            req.body
        );

        if (!updated) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.status(200).json({ message: 'Menu item updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE MENU ITEM
exports.deleteMenuItem = async (req, res) => {
    try {
        const deleted = await menuItemModel.deleteMenuItem(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};