const Inventory = require("../Models/InventoryModel")

// Create - Add new inventory item
const createItem = async (req, res) => {
  const { name, category, quantity, price } = req.body

  const newItem = new Inventory({
    name,
    category,
    quantity,
    price,
  })

  try {
    await newItem.save()
    res.status(201).json({ message: "Item added successfully" })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Read - Get all inventory items
const getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find()
    res.status(200).json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Read - Get a single inventory item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }
    res.status(200).json(item)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Update - Update an inventory item
const updateItem = async (req, res) => {
  const { name, category, quantity, price } = req.body

  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      { name, category, quantity, price },
      { new: true },
    )
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" })
    }
    res.status(200).json(updatedItem)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Delete - Delete an inventory item
const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Inventory.findByIdAndDelete(req.params.id)
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" })
    }
    res.status(200).json({ message: "Item deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
}
