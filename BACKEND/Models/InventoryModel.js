const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

// Check if the model already exists before defining it
const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;
