const express = require('express');
const mongoose = require('mongoose'); 
const router  = require('./Routes/StudentRoutes');
const activityRoutes = require('./Routes/RecentActivityRoutes');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/student" , router);
app.use("/activity", activityRoutes);

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:itp25@cluster0.srq74.mongodb.net/yourDatabaseName", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {console.log("MongoDB Connected");
        app.listen(5000);
    })
    .catch((err) => console.log(err));
