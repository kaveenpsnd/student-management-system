const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Import routes
const studentRoutes = require("./Routes/StudentRoutes");
const attendanceRoutes = require("./Routes/AttendanceRoutes");
const examResultsRoutes = require("./Routes/ExamResultsRoutes");
const inventoryRoutes = require("./Routes/InventoryRoutes");
const recentActivityRoutes = require("./Routes/RecentActivityRoutes");
const staffRoutes = require("./Routes/StaffRoutes");
const leaveRoutes = require("./Routes/LeaveRoutes");
const staffAttendanceRoutes = require("./Routes/StaffAttendanceRoutes");

const app = express();

// Create uploads directories if not exist
const uploadDir = path.join(__dirname, "uploads");
const staffUploadsDir = path.join(uploadDir, "staff");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(staffUploadsDir)) {
  fs.mkdirSync(staffUploadsDir, { recursive: true });
}

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/student", studentRoutes);
app.use("/activity", recentActivityRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/exam-results", examResultsRoutes);
app.use("/attendance", attendanceRoutes);

// Staff-related API routes
app.use("/api/staff", staffRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/staff-attendance", staffAttendanceRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// MongoDB connection
const MONGODB_URI = "mongodb+srv://admin:itp25@mkv.yzfyd75.mongodb.net/SSMS";
const PORT = 5000;

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
};

// Start the connection
connectWithRetry();
