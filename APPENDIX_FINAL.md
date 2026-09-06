# APPENDIX

---

## APPENDIX - A: SYSTEM REQUIREMENTS

### A.1 Hardware Requirements:
- **Processor:** Intel Core i3 or higher
- **RAM:** Minimum 4 GB (8 GB recommended)
- **Storage:** 10 GB free space (for project files and images)
- **Camera:** Smartphone/DSLR for capturing group photos
- **Internet:** Broadband connection for web interface

### A.2 Software Requirements:
- **Operating System:** Windows 10/11, Linux, or macOS
- **Node.js:** v14 or above
- **Python:** 3.7+
- **Express.js:** v5.1.0
- **OpenCV:** opencv-python
- **face_recognition library**
- **Multer:** v2.0.2
- **CORS:** v2.8.5
- **Code Editor:** VS Code (recommended)
- **Browser:** Chrome 90+, Firefox 88+, or Safari 14+

---

## APPENDIX - B: DATA STRUCTURES

### B.1 students.json Format:

```json
[
  {
    "id": 1763474648122,
    "name": "Avril Fiona",
    "usn": "1MS21CS001",
    "department": "Computer Science",
    "year": "2021",
    "email": "avril@example.com",
    "password": "1MS21CS001",
    "images": [
      "1763474648122-avril (2).jpeg",
      "1763474648131-avril (4).jpeg",
      "1763474648134-avril (8).jpeg"
    ]
  },
  {
    "id": 1763474888206,
    "name": "Dashamee",
    "usn": "1MS21CS002",
    "department": "Computer Science",
    "year": "2021",
    "email": "dashamee@example.com",
    "password": "1MS21CS002",
    "images": [
      "1763474888206-dashamee (4).jpeg",
      "1763474888209-dashamee (22).jpg"
    ]
  }
]
```

### B.2 attendance.json Format:

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

---

## APPENDIX - C: MAIN PYTHON SCRIPTS

### C.1 encode_faces.py

```python
import face_recognition
import os
import pickle
import json

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SCRIPT_DIR)

# Paths
UPLOADS_DIR = os.path.join(BACKEND_DIR, "uploads")
STUDENTS_JSON = os.path.join(BACKEND_DIR, "data", "students.json")
ENCODINGS_FILE = os.path.join(SCRIPT_DIR, "encodings.pkl")

print(f"[INFO] Backend directory: {BACKEND_DIR}")
print(f"[INFO] Uploads directory: {UPLOADS_DIR}")
print(f"[INFO] Students JSON: {STUDENTS_JSON}")
print(f"[INFO] Encodings file: {ENCODINGS_FILE}\n")

known_encodings = []
known_names = []

# Load students from JSON
with open(STUDENTS_JSON, 'r') as f:
    students = json.load(f)

if len(students) == 0:
    print("[WARNING] No students found in database!")
    exit(0)

print(f"[INFO] Found {len(students)} students in database\n")

# Process each student
for student in students:
    student_name = student.get('name', 'Unknown')
    student_images = student.get('images', [])
    
    if len(student_images) == 0:
        print(f"[WARNING] {student_name} has no images, skipping...")
        continue
    
    print(f"[INFO] Processing {student_name} ({len(student_images)} images)")
    
    for img_filename in student_images:
        img_path = os.path.join(UPLOADS_DIR, img_filename)
        
        if not os.path.exists(img_path):
            print(f" → [WARNING] Image not found: {img_filename}")
            continue
        
        try:
            image = face_recognition.load_image_file(img_path)
            encodings = face_recognition.face_encodings(image)
            
            if len(encodings) > 0:
                known_encodings.append(encodings[0])
                known_names.append(student_name)
                print(f" → ✓ Encoded: {img_filename}")
            else:
                print(f" → ✗ No face found in: {img_filename}")
        except Exception as e:
            print(f" → ✗ Error processing {img_filename}: {str(e)}")

# Save encodings
if len(known_encodings) > 0:
    with open(ENCODINGS_FILE, "wb") as f:
        pickle.dump({
            "encodings": known_encodings,
            "names": known_names
        }, f)
    
    print(f"\n[SUCCESS] Encoding complete!")
    print(f"[INFO] Encoded {len(known_encodings)} faces")
    print(f"[INFO] Saved to: {ENCODINGS_FILE}")
else:
    print("\n[ERROR] No faces were encoded!")
```

### C.2 recognize.py

```python
import face_recognition
import cv2
import pickle
import sys
import os
import json
import numpy as np

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ENCODINGS_PATH = os.path.join(SCRIPT_DIR, "encodings.pkl")

def load_encodings():
    with open(ENCODINGS_PATH, "rb") as f:
        data = pickle.load(f)
    encs = data.get("encodings", [])
    names = data.get("names", [])
    return encs, names

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "no image path provided"}))
        return

    group_image_path = sys.argv[1]
    if not os.path.exists(group_image_path):
        print(json.dumps({"error": "image not found"}))
        return

    # Load known encodings
    try:
        known_encodings, known_names = load_encodings()
    except Exception as e:
        print(json.dumps({
            "error": "failed to load encodings", 
            "details": str(e)
        }))
        return

    # Load group image
    image = face_recognition.load_image_file(group_image_path)
    
    # Detect faces
    locations = face_recognition.face_locations(image, model="hog")
    encodings = face_recognition.face_encodings(image, locations)

    present = []
    
    # Compare each detected face with known encodings
    for face_encoding in encodings:
        matches = face_recognition.compare_faces(
            known_encodings, 
            face_encoding, 
            tolerance=0.5
        )
        face_distances = face_recognition.face_distance(
            known_encodings, 
            face_encoding
        )

        name = None
        if any(matches):
            best_idx = np.argmin(face_distances)
            name = known_names[best_idx]
        else:
            name = "Unknown"

        if name != "Unknown":
            present.append(name)

    # Determine absent list
    unique_present = list(dict.fromkeys(present))
    absent = [n for n in sorted(set(known_names)) 
              if n not in unique_present]

    # Output JSON
    out = {"present": unique_present, "absent": absent}
    print(json.dumps(out))

if __name__ == "__main__":
    main()
```

---

## APPENDIX - D: NODE.JS BACKEND CODE

### D.1 index.js (Main Server File)

```javascript
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/group_photos', 
    express.static(path.join(__dirname, 'group_photos')));

// Routes
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendance");
const groupUploadRoutes = require("./routes/groupUpload");
const authRoutes = require("./routes/auth");

app.use("/students", studentRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/upload-group-photo", groupUploadRoutes);
app.use("/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ 
    message: "Smart Attendance System API",
    status: "Running ✔",
    endpoints: {
      students: "/students",
      attendance: "/attendance",
      auth: "/auth"
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

### D.2 routes/attendance.js (Attendance Marking)

```javascript
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();
const attendanceDB = path.join(__dirname, "../data/attendance.json");

// Multer storage for group photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads/group");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// POST /attendance/mark
router.post("/mark", upload.single("groupImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = path.resolve(req.file.path);
  const pythonPath = path.join(__dirname, "../python/recognize.py");

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
      const result = JSON.parse(stdout);
      const attendance = JSON.parse(
        fs.readFileSync(attendanceDB, "utf8")
      );
      
      attendance.push({
        date: new Date().toISOString(),
        groupImage: path.relative(
          path.join(__dirname, ".."), 
          imagePath
        ),
        present: result.present,
        absent: result.absent
      });
      
      fs.writeFileSync(
        attendanceDB, 
        JSON.stringify(attendance, null, 2)
      );
      
      return res.json({ success: true, result });
    } catch (err) {
      console.error("PARSE/EXEC ERROR:", err);
      return res.status(500).json({ 
        error: "Recognition failed", 
        details: stderr || err.message 
      });
    }
  });
});

module.exports = router;
```

---

## APPENDIX - E: INSTALLATION GUIDE

### E.1 Installing Node.js:

1. Download from https://nodejs.org
2. Install using the setup wizard
3. Verify installation:

```bash
node -v
npm -v
```

### E.2 Installing Python Dependencies:

```bash
pip install face_recognition
pip install opencv-python
pip install numpy
pip install pillow
```

**Note:** On Windows, you may need to install cmake and dlib first:

```bash
pip install cmake
pip install dlib
pip install face_recognition
```

### E.3 Installing Node Dependencies:

Navigate to backend folder and run:

```bash
cd backend
npm install
```

This installs:
- express (v5.1.0)
- multer (v2.0.2)
- cors (v2.8.5)
- body-parser (v2.2.0)

---

## APPENDIX - F: HOW TO RUN THE PROJECT

### Step 1: Setup Backend

```bash
cd backend
npm install
npm run setup
```

This creates necessary folders and data files.

### Step 2: Start the Backend Server

```bash
cd backend
npm start
```

Server will run on: **http://localhost:5000**

### Step 3: Start the Frontend

Open a new terminal:

```bash
cd frontend
python -m http.server 8080
```

Frontend will run on: **http://localhost:8080**

### Step 4: Access the Application

Open browser and go to: **http://localhost:8080**

### Step 5: Login

**Admin:**
- Username: `admin`
- Password: `admin123`

**Student:**
- USN: Their registered USN (e.g., 1MS21CS001)
- Password: Default is their USN

### Step 6: Add Students

1. Login as admin
2. Go to "Manage Students"
3. Click "Add Student"
4. Fill in details:
   - Name
   - USN
   - Department
   - Year
   - Email
   - Password (optional)
5. Upload 3-5 clear face images
6. Click "Save Student"

### Step 7: Encode Student Faces (Important!)

After adding students, run:

```bash
cd backend/python
python encode_faces.py
```

This creates face encodings needed for recognition.

### Step 8: Mark Attendance

1. Go to "Mark Attendance"
2. Upload a group photo containing students
3. System will automatically recognize faces
4. View present/absent lists

### Step 9: View Attendance

**Admin:**
- View complete attendance history
- Filter by date
- See detailed reports

**Student:**
- View personal attendance records
- Check attendance percentage
- See present/absent status

---

## APPENDIX - G: TEST CASES

| Test ID | Input | Expected Output | Result |
|---------|-------|-----------------|--------|
| TC01 | Valid admin login (admin/admin123) | Dashboard loads successfully | Pass |
| TC02 | Invalid admin password | Error message displayed | Pass |
| TC03 | Add student with all fields | Student added to database | Pass |
| TC04 | Add student without USN | Error message shown | Pass |
| TC05 | Upload student images (3 files) | Images uploaded successfully | Pass |
| TC06 | Upload more than 5 images | Error message displayed | Pass |
| TC07 | Run face encoding script | Encodings created successfully | Pass |
| TC08 | Upload group photo for attendance | Faces recognized correctly | Pass |
| TC09 | Unknown face in group photo | Marked as absent | Pass |
| TC10 | Multiple faces (10+) in photo | All faces detected | Pass |
| TC11 | Student login with valid USN | Dashboard loads | Pass |
| TC12 | Student login with wrong password | Error message shown | Pass |
| TC13 | View attendance history | All records displayed | Pass |
| TC14 | Filter attendance by date | Filtered results shown | Pass |
| TC15 | Calculate attendance percentage | Correct percentage displayed | Pass |
| TC16 | Edit student information | Student updated successfully | Pass |
| TC17 | Delete student | Student removed from database | Pass |
| TC18 | View today's attendance | Today's records displayed | Pass |
| TC19 | Poor lighting in group photo | Some faces may not be detected | Pass |
| TC20 | High quality group photo | All faces detected accurately | Pass |

---

## APPENDIX - H: GLOSSARY

**Encoding:** 128-dimensional numerical vector representing unique facial features extracted from an image.

**HOG (Histogram of Oriented Gradients):** Algorithm used for face detection that analyzes the distribution of intensity gradients in an image.

**Embedding:** Mathematical representation of a face in vector space, allowing for comparison and matching.

**DFD (Data Flow Diagram):** Visual representation showing how data flows through the system.

**UI (User Interface):** Visual elements and components that users interact with.

**USN (University Seat Number):** Unique identifier assigned to each student for login and identification.

**API (Application Programming Interface):** Set of protocols enabling communication between frontend and backend.

**CRUD:** Create, Read, Update, Delete - basic database operations.

**JSON (JavaScript Object Notation):** Lightweight data storage and exchange format.

**REST (Representational State Transfer):** Architectural style for designing networked applications.

**Tolerance:** Threshold value (0.5) used in face matching to determine if two faces are similar enough to be considered a match.

**pkl (Pickle):** Python file format for serializing and storing Python objects.

**Multer:** Node.js middleware for handling multipart/form-data, primarily used for file uploads.

**CORS (Cross-Origin Resource Sharing):** Security feature allowing controlled access to resources from different origins.

**Express.js:** Web application framework for Node.js used to build APIs and web applications.

**OpenCV:** Open-source computer vision library used for image processing operations.

**face_recognition:** Python library built on dlib for face detection and recognition tasks.

**Spawn:** Node.js method to create child processes, used to execute Python scripts from Node.js.

**Session Storage:** Web storage mechanism for storing data temporarily during a browser session.

---

**END OF APPENDIX**

---

**Page Count:** Approximately 8-10 pages when formatted properly

**Font Recommendations:**
- Body Text: Times New Roman, 12pt
- Code: Courier New, 10pt
- Headings: Bold, 14-16pt

**Formatting Tips:**
- Use 1.5 line spacing
- Add page numbers
- Include proper indentation for code
- Add syntax highlighting if possible
