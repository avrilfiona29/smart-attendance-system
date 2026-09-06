const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// POST /auth/student-login
router.post('/student-login', async (req, res) => {
  try {
    const { usn, password } = req.body;

    if (!usn || !password) {
      return res.status(400).json({ error: 'USN and password are required' });
    }

    const student = await Student.findOne({ usn: usn.toUpperCase() });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentPassword = student.password || student.usn;
    if (password !== studentPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Return student info without password
    const studentData = student.toObject();
    delete studentData.password;

    res.json({ message: 'Login successful', student: studentData });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// POST /auth/admin-login
router.post('/admin-login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username === 'admin' && password === 'admin123') {
    res.json({ message: 'Login successful', role: 'admin', username });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;
