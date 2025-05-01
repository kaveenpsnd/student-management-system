const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")

// Import routes
const studentRoutes = require("./Routes/StudentRoutes")
const attendanceRoutes = require("./Routes/AttendanceRoutes")
const examResultsRoutes = require("./Routes/ExamResultsRoutes")
const inventoryRoutes = require("./Routes/inventoryRoutes")
const recentActivityRoutes = require("./Routes/RecentActivityRoutes")
const staffRoutes = require("./Routes/StaffRoutes")
const leaveRoutes = require("./Routes/LeaveRoutes")
const staffAttendanceRoutes = require("./Routes/StaffAttendanceRoutes")

const app = express()

// Create uploads directory if it doesn't exist
const fs = require("fs")
const uploadDir = path.join(__dirname, "uploads")
const staffUploadsDir = path.join(uploadDir, "staff")

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

if (!fs.existsSync(staffUploadsDir)) {
  fs.mkdirSync(staffUploadsDir, { recursive: true })
}

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes - Keep original routes to maintain compatibility with existing frontend
app.use("/student", studentRoutes)
app.use("/activity", recentActivityRoutes)
app.use("/inventory", inventoryRoutes)
app.use("/exam-results", examResultsRoutes)
app.use("/attendance", attendanceRoutes)

// New API routes with /api prefix for staff management
app.use("/api/staff", staffRoutes)
app.use("/api/leaves", leaveRoutes)
app.use("/api/staff-attendance", staffAttendanceRoutes)

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running...")
})

// Connect to MongoDB
const MONGODB_URI = "mongodb+srv://admin:itp25@mkv.yzfyd75.mongodb.net/SSMS"
const PORT = process.env.PORT || 5000

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => console.log("MongoDB connection error:", err))
