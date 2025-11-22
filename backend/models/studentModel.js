const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/students.json');

// Read DB
function readDB() {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(dataPath));
}

// Write DB
function writeDB(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// MODEL FUNCTIONS
function getAllStudents() {
  return readDB();
}

function addStudent(studentData) {
  const students = readDB();

  const newStudent = {
    id: Date.now(),
    name: studentData.name,
    usn: studentData.usn,
    department: studentData.department,
    year: studentData.year,
    email: studentData.email,
    password: studentData.password || studentData.usn, // Default password is USN
    images: studentData.images || []
  };

  students.push(newStudent);
  writeDB(students);

  return newStudent;
}

function updateStudent(id, updatedData) {
  const students = readDB();
  const index = students.findIndex(s => String(s.id) === String(id));

  if (index === -1) return null;

  const updatedStudent = {
    ...students[index],
    ...updatedData
  };

  students[index] = updatedStudent;
  writeDB(students);

  return updatedStudent;
}

function deleteStudent(id) {
  const students = readDB();
  const filtered = students.filter(s => s.id != id);

  if (filtered.length === students.length) return false;

  writeDB(filtered);
  return true;
}

// GET BY USN
function getStudentByUsn(usn) {
  const students = readDB();
  return students.find(s => s.usn === usn);
}

// SAVE ENTIRE JSON (used in image upload)
function saveStudents(students) {
  writeDB(students);
}

// EXPORT EVERYTHING
module.exports = {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getStudentByUsn,
  saveStudents
};
