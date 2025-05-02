const express = require('express');
const router = express.Router();
const inventoryController = require("../Controllers/inventoryController");
const Inventory = require('../Models/InventoryModel');

// Create: Add new inventory item
router.post('/', inventoryController.createItem);

// Read: Get all inventory items
router.get('/', inventoryController.getAllItems);

// Get stock report
router.get('/reports/stock', async (req, res) => {
    try {
        const stockReport = await Inventory.find({}, {
            name: 1,
            quantity: 1,
            category: 1,
            lastRestocked: 1,
            _id: 0
        }).sort({ category: 1, name: 1 });
        
        res.json(stockReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read: Get a single inventory item by ID
router.get('/:id', inventoryController.getItemById);

// Update: Update an inventory item
router.put('/:id', inventoryController.updateItem);

// Delete: Delete an inventory item
router.delete('/:id', inventoryController.deleteItem);

module.exports = router;
