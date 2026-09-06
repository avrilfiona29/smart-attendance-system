const express = require('express');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const Attendance = require('../models/Attendance');
const { uploadGroupPhoto, cloudinary } = require('../config/cloudinary');

const router = express.Router();

// Hugging Face Space URL for face recognition
const HF_RECOGNIZE_URL = process.env.HF_RECOGNIZE_URL || 'https://your-space.hf.space/recognize';

// GET /attendance/today
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const records = await Attendance.find({
      date: { $gte: today, $lt: tomorrow },
    }).sort({ date: -1 });

    res.json({ attendance: records });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch today\'s attendance' });
  }
});

// POST /attendance/mark — Upload group photo → run face recognition → save
router.post('/mark', uploadGroupPhoto.single('groupImage'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const cloudinaryUrl = req.file.path;
  const cloudinaryId  = req.file.filename;

  try {
    // Fetch the image from Cloudinary and forward to Hugging Face
    const imageResponse = await fetch(cloudinaryUrl);
    const imageBuffer = await imageResponse.buffer();

    const form = new FormData();
    form.append('file', imageBuffer, {
      filename: req.file.originalname || 'group.jpg',
      contentType: req.file.mimetype || 'image/jpeg',
    });

    const hfResponse = await fetch(HF_RECOGNIZE_URL, {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

    if (!hfResponse.ok) {
      const errText = await hfResponse.text();
      return res.status(500).json({ error: 'Recognition service error', details: errText });
    }

    const result = await hfResponse.json();

    const record = new Attendance({
      date: new Date(),
      groupImage: { url: cloudinaryUrl, public_id: cloudinaryId },
      present: result.present,
      absent: result.absent,
    });

    await record.save();
    return res.json({ success: true, result });

  } catch (err) {
    console.error('Attendance mark error:', err);
    return res.status(500).json({ error: 'Recognition failed', details: err.message });
  }
});

// GET /attendance/history
router.get('/history', async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance history' });
  }
});

// GET /attendance/history/:date  (format: YYYY-MM-DD)
router.get('/history/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    if (isNaN(date)) return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const records = await Attendance.find({
      date: { $gte: date, $lt: nextDay },
    }).sort({ date: -1 });

    if (records.length === 0) {
      return res.json({ message: 'No attendance found for this date' });
    }

    res.json({ date: req.params.date, records });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /attendance/reset
router.delete('/reset', async (req, res) => {
  try {
    await Attendance.deleteMany({});
    res.json({ message: 'Attendance reset successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Reset failed' });
  }
});

module.exports = router;
