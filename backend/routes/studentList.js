const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/", (req, res) => {
  const studentsPath = path.join(__dirname, "../data/students.json");
  const data = JSON.parse(fs.readFileSync(studentsPath));
  res.json({ students: data });
});

module.exports = router;
