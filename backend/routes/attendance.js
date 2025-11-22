const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();
const attendanceDB = path.join(__dirname, "../data/attendance.json");

// Helper function to safely read JSON files
function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("JSON READ ERROR:", err);
    return [];
  }
}


// ensure attendance DB exists
if (!fs.existsSync(attendanceDB)) fs.writeFileSync(attendanceDB, "[]");

// multer storage for group photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads/group");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

router.get("/today", (req, res) => {
  const data = JSON.parse(fs.readFileSync(attendanceDB));

  // get entries only for today
  const today = new Date().toISOString().split("T")[0];

  const todayData = data.filter(a => a.date.startsWith(today));

  res.json({ attendance: todayData });
});


// POST /attendance/mark  (body: form-data with key 'groupImage' file)
router.post("/mark", upload.single("groupImage"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const imagePath = path.resolve(req.file.path); // absolute path
  const pythonPath = path.join(__dirname, "../python/recognize.py");

  // spawn python: ["python", "path/to/recognize.py", "<imagePath>"]
  const py = spawn("python", [pythonPath, imagePath]);

  let stdout = "";
  let stderr = "";

  py.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  py.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  py.on("close", (code) => {
    if (stderr) console.error("PYTHON STDERR:", stderr);

    try {
      const result = JSON.parse(stdout); // expect JSON string from python
      // Save attendance record
      const attendance = JSON.parse(fs.readFileSync(attendanceDB, "utf8"));
      attendance.push({
        date: new Date().toISOString(),
        groupImage: path.relative(path.join(__dirname, ".."), imagePath), // store relative
        present: result.present,
        absent: result.absent
      });
      fs.writeFileSync(attendanceDB, JSON.stringify(attendance, null, 2));
      return res.json({ success: true, result });
    } catch (err) {
      console.error("PARSE/EXEC ERROR:", err);
      return res.status(500).json({ error: "Recognition failed", details: stderr || err.message });
    }
  });
});

// GET /attendance/history
router.get("/history", (req, res) => {
  try {
    const attendance = JSON.parse(fs.readFileSync(attendanceDB, "utf8"));
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: "Could not load attendance history" });
  }
});


// GET /attendance/history/:date  → Get attendance for a specific date
router.get('/history/:date', (req, res) => {
  const requestedDate = req.params.date; // e.g., "2025-11-19"
  console.log("Requested date:", requestedDate);

  try {
    const attendance = JSON.parse(fs.readFileSync(attendanceDB, "utf8"));
    console.log("Attendance file loaded:", attendance);

    // Filter entries where the date part matches requestedDate
    const filtered = attendance.filter(a => {
      const recordDate = new Date(a.date).toISOString().split('T')[0];
      return recordDate === requestedDate;
    });

    if (filtered.length === 0) {
      return res.json({ message: "No attendance found for this date" });
    }

    res.json({
      date: requestedDate,
      records: filtered
    });

  } catch (err) {
    console.error("History Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});



// DELETE /attendance/reset
router.delete("/reset", (req, res) => {
  try {
    fs.writeFileSync(attendanceDB, "[]");
    res.json({ message: "Attendance reset successfully" });
  } catch (err) {
    res.status(500).json({ error: "Reset failed" });
  }
});

module.exports = router;
