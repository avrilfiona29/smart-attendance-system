require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendance');
const groupUploadRoutes = require('./routes/groupUpload');
const authRoutes = require('./routes/auth');

app.use('/students', studentRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/upload-group-photo', groupUploadRoutes);
app.use('/auth', authRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Attendance System API',
    status: 'Running ✔',
    database: 'MongoDB Atlas',
    endpoints: {
      students: '/students',
      attendance: '/attendance',
      auth: '/auth',
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
