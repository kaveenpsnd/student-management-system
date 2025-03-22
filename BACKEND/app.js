const express = require('express');
const mongoose = require('mongoose');
const router = require('./Routes/StudentRoutes');
const inventoryRoutes = require('./Routes/InventoryRoutes');
const activityRoutes = require('./Routes/RecentActivityRoutes');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
  }));
app.use(express.json());
app.use("/student", router);
app.use("/activity", activityRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Test Route
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// Use Inventory Routes
app.use("/inventory", inventoryRoutes);

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:itp25@cluster0.srq74.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(5000);
    })
    .catch((err) => console.log(err));
