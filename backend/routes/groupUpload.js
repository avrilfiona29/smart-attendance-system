const express = require("express");
const router = express.Router();
const multer = require("multer");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/group/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// POST /upload-group-photo
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.json({ error: "No image uploaded" });
  }

  const imagePath = path.join("uploads/group/", req.file.filename);

  // Call Python script
  const python = spawn("python", ["../yolo_training/test_recognition.py", imagePath]);

  python.stdout.on("data", (data) => {
    console.log("Python Output:", data.toString());
  });

  python.stderr.on("data", (data) => {
    console.error("Python Error:", data.toString());
  });

  python.on("close", () => {
    res.json({
      success: true,
      message: "Attendance marked using uploaded group photo",
      file: req.file.filename
    });
  });
});

module.exports = router;
