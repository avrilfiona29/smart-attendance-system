const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/students.json");

const readData = () => {
  const jsonData = fs.readFileSync(dataPath);
  return JSON.parse(jsonData);
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Add Student
exports.addStudent = (req, res) => {
  const { name, roll } = req.body;

  const db = readData();

  const newStudent = {
    id: Date.now(),
    name,
    roll,
    images: []
  };

  db.students.push(newStudent);

  writeData(db);

  res.json({ message: "Student added!", student: newStudent });
};

// Get all students
exports.getStudents = (req, res) => {
  const db = readData();
  res.json(db.students);
};
