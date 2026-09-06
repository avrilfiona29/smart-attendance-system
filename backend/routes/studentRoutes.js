const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { uploadStudentImages, cloudinary } = require('../config/cloudinary');

// POST /students/add — Add new student with face photos
router.post('/add', uploadStudentImages.array('images', 5), async (req, res) => {
  try {
    const { name, usn, department, year, email, password } = req.body;

    if (!name || !usn) {
      return res.status(400).json({ error: 'Name and USN are required' });
    }

    // Check if USN already exists
    const existing = await Student.findOne({ usn: usn.toUpperCase() });
    if (existing) {
      return res.status(400).json({ error: 'Student with this USN already exists' });
    }

    // Map uploaded files to image objects (Cloudinary gives us url + public_id)
    const images = req.files
      ? req.files.map((f) => ({
          url: f.path,           // Cloudinary URL
          public_id: f.filename, // Cloudinary public_id
          filename: f.originalname,
        }))
      : [];

    const student = new Student({
      name,
      usn,
      department,
      year,
      email,
      password: password || usn,
      images,
    });

    await student.save();
    res.json({ message: 'Student added successfully', student });
  } catch (err) {
    console.error('Add student error:', err);
    res.status(500).json({ error: 'Failed to add student', details: err.message });
  }
});

// GET /students/all — Get all students
router.get('/all', async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// PUT /students/update/:id — Update student details
router.put('/update/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student updated successfully', student });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// DELETE /students/delete/:id — Delete a student (also removes Cloudinary images)
router.delete('/delete/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    // Delete images from Cloudinary
    for (const img of student.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id).catch(() => {});
      }
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// POST /students/upload-image/:usn — Upload more images for existing student
router.post('/upload-image/:usn', uploadStudentImages.array('images', 10), async (req, res) => {
  try {
    const student = await Student.findOne({ usn: req.params.usn.toUpperCase() });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const newImages = req.files.map((f) => ({
      url: f.path,
      public_id: f.filename,
      filename: f.originalname,
    }));

    student.images.push(...newImages);
    await student.save();

    res.json({ message: 'Images uploaded successfully', images: student.images });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

module.exports = router;
