const express = require('express');
const router = express.Router();
const studentModel = require('../models/studentModel');

// Student Login
router.post('/student-login', (req, res) => {
  const { usn, password } = req.body;

  if (!usn || !password) {
    return res.status(400).json({ error: 'USN and password are required' });
  }

  // Get student by USN
  const student = studentModel.getStudentByUsn(usn);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Check password (use USN as default if no password set)
  const studentPassword = student.password || student.usn;

  if (password !== studentPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Return student info (without password)
  const { password: _, ...studentData } = student;
  
  res.json({ 
    message: 'Login successful',
    student: studentData
  });
});

// Admin Login (simple check)
router.post('/admin-login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Simple admin check (you can enhance this later)
  if (username === 'admin' && password === 'admin123') {
    res.json({ 
      message: 'Login successful',
      role: 'admin',
      username: username
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;
