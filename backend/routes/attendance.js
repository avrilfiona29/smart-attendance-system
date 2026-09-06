const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const https = require('https');
const Attendance = require('../models/Attendance');
const { uploadGroupPhoto, cloudinary } = require('../config/cloudinary');

const router = express.Router();

// Helper: download a file from URL to a temp path (needed for Python script)
function downloadToTemp(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

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

  const cloudinaryUrl = req.file.path;     // Cloudinary URL
  const cloudinaryId  = req.file.filename; // Cloudinary public_id

  // Download image to a temp file so Python can read it
  const tempPath = path.join(os.tmpdir(), `group_${Date.now()}.jpg`);

  try {
    await downloadToTemp(cloudinaryUrl, tempPath);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to download image for processing' });
  }

  const pythonPath = path.join(__dirname, '../python/recognize.py');
  const py = spawn('python', [pythonPath, tempPath]);

  let stdout = '';
  let stderr = '';

  py.stdout.on('data', (data) => { stdout += data.toString(); });
  py.stderr.on('data', (data) => { stderr += data.toString(); });

  py.on('close', async () => {
    // Clean up temp file
    fs.unlink(tempPath, () => {});

    if (stderr) console.error('PYTHON STDERR:', stderr);

    try {
      const result = JSON.parse(stdout);

      const record = new Attendance({
        date: new Date(),
        groupImage: { url: cloudinaryUrl, public_id: cloudinaryId },
        present: result.present,
        absent: result.absent,
      });

      await record.save();
      return res.json({ success: true, result });
    } catch (err) {
      console.error('Recognition parse error:', err);
      return res.status(500).json({ error: 'Recognition failed', details: stderr || err.message });
    }
  });
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
