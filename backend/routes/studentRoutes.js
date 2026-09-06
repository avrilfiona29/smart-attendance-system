const express = require('express');
const router = express.Router();
const studentModel = require('../models/studentModel');
const upload = require("../middleware/studentUpload");

// Add Student with image upload
router.post('/add', upload.array("images", 5), (req, res) => {
  const { name, usn, department, year, email, password } = req.body;

  if (!name || !usn) {
    return res.status(400).json({ error: 'Name and USN are required' });
  }

  const imageFiles = req.files ? req.files.map(f => f.filename) : [];
  const studentPassword = password || usn;

  const result = studentModel.addStudent({
    name, usn, department, year, email,
    password: studentPassword,
    images: imageFiles
  });

  res.json({ message: 'Student added successfully', student: result });
});

// Get all
router.get('/all', (req, res) => {
  res.json(studentModel.getAllStudents());
});

// Update Student
router.put("/update/:id", (req, res) => {
  const studentId = req.params.id;
  const updatedData = req.body;
  const result = studentModel.updateStudent(studentId, updatedData);
  if (!result) return res.status(404).json({ error: "Student not found" });
  res.json({ message: "Student updated successfully", student: result });
});

// Delete student
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const success = studentModel.deleteStudent(id);
  if (!success) return res.status(404).json({ error: 'Student not found' });
  res.json({ message: 'Student deleted successfully' });
});

// Upload images for an existing student
router.post('/upload-image/:usn', upload.array('images', 10), (req, res) => {
  const usn = req.params.usn;
  const students = studentModel.getAllStudents();
  const index = students.findIndex(s => s.usn === usn);
  if (index === -1) return res.status(404).json({ error: "Student not found" });

  const newImages = req.files.map(file => file.filename);
  students[index].images.push(...newImages);
  studentModel.saveStudents(students);

  res.json({ message: "Images uploaded successfully", images: students[index].images });
});

module.exports = router;
