const express = require('express');
const router = express.Router();

const menuItemController = require('../controllers/menuItemController');

// GET ALL MENU ITEMS
router.get('/', menuItemController.getAllMenuItems);

// GET MENU ITEM BY ID
router.get('/:id', menuItemController.getMenuItemById);

// CREATE MENU ITEM
router.post('/', menuItemController.createMenuItem);

// UPDATE MENU ITEM
router.put('/:id', menuItemController.updateMenuItem);

// DELETE MENU ITEM
router.delete('/:id', menuItemController.deleteMenuItem);

module.exports = router;