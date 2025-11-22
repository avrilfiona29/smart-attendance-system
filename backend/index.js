const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/group_photos', express.static(path.join(__dirname, 'group_photos')));

// Routes
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendance");
const groupUploadRoutes = require("./routes/groupUpload");
const authRoutes = require("./routes/auth");

app.use("/students", studentRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/upload-group-photo", groupUploadRoutes);
app.use("/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ 
    message: "Smart Attendance System API",
    status: "Running ✔",
    endpoints: {
      students: "/students",
      attendance: "/attendance",
      groupUpload: "/upload-group-photo"
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

