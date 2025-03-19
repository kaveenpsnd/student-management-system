const express = require('express');
const mongoose = require('mongoose'); 
const router  = require('./Routes/StudentRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use("/student" , router);

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:itp25@cluster0.srq74.mongodb.net/")
    .then(() => {console.log("MongoDB Connected");
        app.listen(5000);
    })
    .catch((err) => console.log(err));
