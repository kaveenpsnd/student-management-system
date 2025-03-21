const express = require('express');
const router = express.Router();
const inventoryController = require("../Controllers/inventoryController");

// Create: Add new inventory item
router.post('/', inventoryController.createItem);

// Read: Get all inventory items
router.get('/', inventoryController.getAllItems);

// Read: Get a single inventory item by ID
router.get('/:id', inventoryController.getItemById);

// Update: Update an inventory item
router.put('/:id', inventoryController.updateItem);

// Delete: Delete an inventory item
router.delete('/:id', inventoryController.deleteItem);

module.exports = router;
