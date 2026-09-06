# 📚 COMPLETE PROJECT EXPLANATION - PART 2

## 🎓 STUDENT PORTAL EXPLAINED

### **How Students Use the System:**

**Step 1: Student Opens Browser**
- Goes to http://localhost:8080
- Sees login page

**Step 2: Student Selects "Student" Role**
- Label changes to "USN (University Seat Number)"
- Hint appears: "Use your registered USN"

**Step 3: Student Enters Credentials**
- USN: 4MW23CS021
- Password: 4MW23CS021 (default is same as USN)
- Clicks "Login"

**What Happens:**
```
1. Browser sends login request:
   → POST http://localhost:5000/auth/student-login
   Body: { "usn": "4MW23CS021", "password": "4MW23CS021" }

2. Backend searches students.json for this USN

3. Backend finds:
   {
     "name": "Avril Fiona",
     "usn": "4MW23CS021",
     "password": "4MW23CS021",
     ...
   }

4. Backend compares passwords:
   Entered: "4MW23CS021"
   Stored: "4MW23CS021"
   → MATCH!

5. Backend sends student data to browser

6. Browser stores in sessionStorage:
   - userRole: "student"
   - studentData: {full student object}
   - username: "Avril Fiona"
   - usn: "4MW23CS021"

7. Browser redirects to student dashboard
```

**Step 4: Student Sees Dashboard**

Shows:
- Days Present: 15
- Days Absent: 3
- Attendance Percentage: 83.3%

**How Percentage is Calculated:**
```javascript
// Backend loads attendance.json
attendance_records = [
  { date: "2024-11-20", present: ["Avril Fiona", ...], absent: [...] },
  { date: "2024-11-21", present: [...], absent: ["Avril Fiona", ...] },
  { date: "2024-11-22", present: ["Avril Fiona", ...], absent: [...] },
  ...
]

// Count present days
present_count = 0
for each record:
    if "Avril Fiona" in record.present:
        present_count++

// Count absent days  
absent_count = 0
for each record:
    if "Avril Fiona" in record.absent:
        absent_count++

// Calculate percentage
total = present_count + absent_count
percentage = (present_count / total) * 100

// Example:
// present_count = 15
// absent_count = 3
// total = 18
// percentage = (15/18) * 100 = 83.3%
```

**Step 5: Student Views Attendance Records**
- Clicks "My Attendance"
- Sees table with:
  - Date: 2024-11-22
  - Time: 10:30 AM
  - Status: ✅ Present

---

## 🗂️ FILE STRUCTURE EXPLAINED

Let me explain what each file does:

### **BACKEND FILES:**

**1. backend/index.js** (Main Server)
```javascript
// This is like the main entrance of a building

// Import required tools
const express = require("express");  // Web framework
const cors = require("cors");        // Allow frontend to talk to backend

// Create server
const app = express();

// Setup middleware (like security guards)
app.use(cors());                     // Allow cross-origin requests
app.use(express.json());             // Understand JSON data

// Setup routes (like different departments)
app.use("/students", studentRoutes);      // Student management
app.use("/attendance", attendanceRoutes); // Attendance management
app.use("/auth", authRoutes);             // Login/authentication

// Start server (open the building)
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
```

**What it does:**
- Starts a web server on port 5000
- Listens for requests from frontend
- Routes requests to correct handlers
- Sends responses back

**2. backend/routes/attendance.js** (Attendance Handler)
```javascript
// This handles all attendance-related requests

// When admin uploads group photo:
router.post("/mark", upload.single("groupImage"), (req, res) => {
  // 1. Get uploaded image
  const imagePath = req.file.path;
  
  // 2. Call Python script
  const py = spawn("python", ["recognize.py", imagePath]);
  
  // 3. Collect Python output
  py.stdout.on("data", (data) => {
    stdout += data.toString();
  });
  
  // 4. When Python finishes
  py.on("close", () => {
    // 5. Parse result
    const result = JSON.parse(stdout);
    // result = { present: [...], absent: [...] }
    
    // 6. Save to attendance.json
    attendance.push({
      date: new Date(),
      present: result.present,
      absent: result.absent
    });
    
    // 7. Send response to frontend
    res.json({ success: true, result });
  });
});
```

**What it does:**
- Receives group photo from frontend
- Saves photo to uploads/group/
- Calls Python script to recognize faces
- Waits for Python to finish
- Saves result to attendance.json
- Sends result back to frontend

**3. backend/routes/auth.js** (Login Handler)
```javascript
// Handles student login
router.post("/student-login", (req, res) => {
  const { usn, password } = req.body;
  
  // 1. Load students.json
  const students = JSON.parse(fs.readFileSync("students.json"));
  
  // 2. Find student with this USN
  const student = students.find(s => s.usn === usn);
  
  // 3. Check if student exists
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  
  // 4. Check password
  if (password !== student.password) {
    return res.status(401).json({ error: "Invalid password" });
  }
  
  // 5. Login successful!
  res.json({ 
    message: "Login successful",
    student: student 
  });
});
```

**What it does:**
- Receives USN and password
- Searches for student in database
- Verifies password
- Returns student data if correct

**4. backend/models/studentModel.js** (Database Operations)
```javascript
// This file handles reading/writing to students.json

function getAllStudents() {
  // Read students.json file
  const data = fs.readFileSync("data/students.json");
  // Convert JSON string to JavaScript object
  return JSON.parse(data);
}

function addStudent(studentData) {
  // 1. Read current students
  const students = getAllStudents();
  
  // 2. Create new student object
  const newStudent = {
    id: Date.now(),  // Unique ID using timestamp
    name: studentData.name,
    usn: studentData.usn,
    ...
  };
  
  // 3. Add to array
  students.push(newStudent);
  
  // 4. Save back to file
  fs.writeFileSync("data/students.json", JSON.stringify(students));
  
  return newStudent;
}
```

**What it does:**
- Provides functions to read/write student data
- Handles all database operations
- Used by other files to access data

### **PYTHON FILES:**

**1. backend/python/encode_faces.py**
```python
# This creates face encodings for all students

import face_recognition
import json
import pickle

# 1. Load students from JSON
with open("../data/students.json") as f:
    students = json.load(f)

known_encodings = []
known_names = []

# 2. For each student
for student in students:
    student_name = student["name"]
    student_images = student["images"]
    
    # 3. For each image
    for image_file in student_images:
        # 4. Load image
        image = face_recognition.load_image_file(f"../uploads/{image_file}")
        
        # 5. Get face encoding (128 numbers)
        encodings = face_recognition.face_encodings(image)
        
        # 6. If face found
        if len(encodings) > 0:
            known_encodings.append(encodings[0])
            known_names.append(student_name)
            print(f"✓ Encoded: {image_file}")

# 7. Save all encodings to file
with open("encodings.pkl", "wb") as f:
    pickle.dump({
        "encodings": known_encodings,
        "names": known_names
    }, f)

print("Encoding complete!")
```

**What it does:**
- Reads all student data
- Loads each student's images
- Extracts face encodings (128 numbers per face)
- Saves all encodings to encodings.pkl

**2. backend/python/recognize.py**
```python
# This recognizes faces in group photos

import face_recognition
import pickle
import sys
import json

# 1. Get image path from command line
group_image_path = sys.argv[1]

# 2. Load known encodings
with open("encodings.pkl", "rb") as f:
    data = pickle.load(f)
    known_encodings = data["encodings"]
    known_names = data["names"]

# 3. Load group photo
image = face_recognition.load_image_file(group_image_path)

# 4. Find all faces in photo
face_locations = face_recognition.face_locations(image)

# 5. Get encodings for all detected faces
face_encodings = face_recognition.face_encodings(image, face_locations)

present = []

# 6. For each detected face
for face_encoding in face_encodings:
    # 7. Compare with all known faces
    matches = face_recognition.compare_faces(
        known_encodings,
        face_encoding,
        tolerance=0.5
    )
    
    # 8. If match found
    if True in matches:
        match_index = matches.index(True)
        name = known_names[match_index]
        present.append(name)

# 9. Find absent students
all_students = list(set(known_names))
absent = [name for name in all_students if name not in present]

# 10. Print result as JSON
print(json.dumps({
    "present": present,
    "absent": absent
}))
```

**What it does:**
- Receives group photo path
- Loads known face encodings
- Detects all faces in group photo
- Compares each face with known faces
- Returns present and absent students as JSON

### **FRONTEND FILES:**

**1. frontend/index.html** (Login Page)
```html
<!-- Login form -->
<form id="loginForm">
  <select id="roleSelect">
    <option value="admin">Admin</option>
    <option value="student">Student</option>
  </select>
  
  <input type="text" id="usernameInput">
  <input type="password" id="passwordInput">
  
  <button type="submit">Login</button>
</form>

<script>
// When form is submitted
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const role = document.getElementById('roleSelect').value;
  const username = document.getElementById('usernameInput').value;
  const password = document.getElementById('passwordInput').value;
  
  if (role === 'admin') {
    // Call admin login API
    const response = await fetch('http://localhost:5000/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      // Login successful
      window.location.href = 'admin/dashboard.html';
    }
  }
});
</script>
```

**What it does:**
- Shows login form
- Collects username and password
- Sends to backend API
- Redirects to dashboard if successful

**2. frontend/config.js** (API Configuration)
```javascript
// Base URL for all API calls
const API_BASE_URL = 'http://localhost:5000';

// All API endpoints in one place
const API = {
  auth: {
    adminLogin: `${API_BASE_URL}/auth/admin-login`,
    studentLogin: `${API_BASE_URL}/auth/student-login`
  },
  students: {
    add: `${API_BASE_URL}/students/add`,
    all: `${API_BASE_URL}/students/all`,
    update: (id) => `${API_BASE_URL}/students/update/${id}`,
    delete: (id) => `${API_BASE_URL}/students/delete/${id}`
  },
  attendance: {
    mark: `${API_BASE_URL}/attendance/mark`,
    history: `${API_BASE_URL}/attendance/history`
  }
};

// Helper function for API calls
async function apiCall(url, options = {}) {
  const response = await fetch(url, options);
  return await response.json();
}
```

**What it does:**
- Stores all API URLs in one place
- Provides helper function for API calls
- Makes code cleaner and easier to maintain

**3. frontend/admin/attendance.html** (Mark Attendance Page)
```html
<!-- Upload area -->
<div id="uploadArea" onclick="document.getElementById('fileInput').click()">
  <i class="fas fa-cloud-upload-alt"></i>
  <h4>Click to Upload Group Photo</h4>
</div>

<input type="file" id="fileInput" style="display:none" onchange="previewImage(event)">

<!-- Image preview -->
<div id="imagePreview" style="display:none">
  <img id="previewImg">
  <button onclick="markAttendance()">Mark Attendance</button>
</div>

<!-- Results -->
<div id="resultDiv" style="display:none">
  <h4>Present Students:</h4>
  <ul id="presentList"></ul>
  
  <h4>Absent Students:</h4>
  <ul id="absentList"></ul>
</div>

<script>
function previewImage(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    document.getElementById('previewImg').src = e.target.result;
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('imagePreview').style.display = 'block';
  };
  
  reader.readAsDataURL(file);
}

async function markAttendance() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  
  // Create form data
  const formData = new FormData();
  formData.append('groupImage', file);
  
  // Show loading
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('loadingDiv').style.display = 'block';
  
  // Send to backend
  const response = await fetch('http://localhost:5000/attendance/mark', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  
  // Hide loading
  document.getElementById('loadingDiv').style.display = 'none';
  
  // Show results
  document.getElementById('presentList').innerHTML = 
    result.result.present.map(name => `<li>${name}</li>`).join('');
  document.getElementById('absentList').innerHTML = 
    result.result.absent.map(name => `<li>${name}</li>`).join('');
  document.getElementById('resultDiv').style.display = 'block';
}
</script>
```

**What it does:**
- Shows upload area
- Previews selected image
- Sends image to backend
- Shows loading spinner
- Displays present/absent results

---

## 📊 DATA STORAGE EXPLAINED

### **students.json Structure:**

```json
[
  {
    "id": 1763474648122,
    "name": "Avril Fiona",
    "usn": "4MW23CS021",
    "department": "Computer Science",
    "year": "2021",
    "email": "avril@example.com",
    "password": "4MW23CS021",
    "images": [
      "1763474648122-avril (2).jpeg",
      "1763474648131-avril (4).jpeg",
      "1763474648134-avril (8).jpeg"
    ]
  }
]
```

**Field Explanations:**
- **id**: Unique identifier (timestamp when added)
- **name**: Student's full name
- **usn**: University Seat Number (used for login)
- **department**: Which department (CSE, ECE, etc.)
- **year**: Year of study
- **email**: Contact email
- **password**: Login password (default is USN)
- **images**: Array of image filenames stored in uploads/

### **attendance.json Structure:**

```json
[
  {
    "date": "2024-11-22T10:30:00.000Z",
    "groupImage": "uploads/group/1732345678901-group.jpg",
    "present": ["Avril Fiona", "Dashamee", "Khushi"],
    "absent": ["Kamath Mayur"]
  }
]
```

**Field Explanations:**
- **date**: When attendance was marked (ISO format)
- **groupImage**: Path to the group photo used
- **present**: Array of student names who were present
- **absent**: Array of student names who were absent

### **encodings.pkl Structure:**

```python
{
  "encodings": [
    [0.234, -0.567, 0.891, ...],  # Avril's face 1
    [0.235, -0.568, 0.890, ...],  # Avril's face 2
    [0.123, -0.456, 0.789, ...],  # Dashamee's face 1
    ...
  ],
  "names": [
    "Avril Fiona",
    "Avril Fiona",
    "Dashamee",
    ...
  ]
}
```

**Explanation:**
- **encodings**: List of 128-number arrays (one per image)
- **names**: Corresponding student names
- **Note**: Same student appears multiple times (one per image)

---

