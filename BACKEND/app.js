const express = require("express")
const mongoose = require("mongoose")
const router = require("./Routes/StudentRoutes")
const inventoryRoutes = require("./Routes/InventoryRoutes")
const activityRoutes = require("./Routes/RecentActivityRoutes")
const examResultsRoutes = require("./Routes/ExamResultsRoutes")
const attendanceRoutes = require("./Routes/AttendanceRoutes")
const eventRoutes = require("./Routes/EventRoutes")

const cors = require("cors")
const path = require("path")

const app = express()

// Create uploads directory if it doesn't exist
const fs = require("fs")
const uploadDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
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
app.use("/student", router)
app.use("/activity", activityRoutes)
app.use("/inventory", inventoryRoutes)
app.use("/exam-results", examResultsRoutes)
app.use("/attendance", attendanceRoutes) // Add this line
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/events", eventRoutes) 

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running...")
})

// Connect to MongoDB
const MONGODB_URI = "mongodb+srv://admin:itp25@mkv.5cddqys.mongodb.net/SSMS"
const PORT = 5000


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
