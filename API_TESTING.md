# API Testing Guide

Test your backend API endpoints using curl, Postman, or browser.

## Base URL
```
http://localhost:5000
```

## Test Server Status

### GET / (Root)
```bash
curl http://localhost:5000
```

**Expected Response:**
```json
{
  "message": "Smart Attendance System API",
  "status": "Running ✔",
  "endpoints": {
    "students": "/students",
    "attendance": "/attendance",
    "groupUpload": "/upload-group-photo"
  }
}
```

---

## Student Endpoints

### 1. Get All Students
```bash
curl http://localhost:5000/students/all
```

**Response:**
```json
[
  {
    "id": 1234567890,
    "name": "John Doe",
    "usn": "1MS21CS001",
    "department": "Computer Science",
    "year": "2021",
    "email": "john@example.com",
    "images": ["1234567890-photo1.jpg", "1234567890-photo2.jpg"]
  }
]
```

### 2. Add Student (with images)
```bash
curl -X POST http://localhost:5000/students/add \
  -F "name=John Doe" \
  -F "usn=1MS21CS001" \
  -F "department=Computer Science" \
  -F "year=2021" \
  -F "email=john@example.com" \
  -F "images=@/path/to/photo1.jpg" \
  -F "images=@/path/to/photo2.jpg"
```

**Response:**
```json
{
  "message": "Student added successfully",
  "student": {
    "id": 1234567890,
    "name": "John Doe",
    "usn": "1MS21CS001",
    "department": "Computer Science",
    "year": "2021",
    "email": "john@example.com",
    "images": ["1234567890-photo1.jpg", "1234567890-photo2.jpg"]
  }
}
```

### 3. Update Student
```bash
curl -X PUT http://localhost:5000/students/update/1234567890 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "department": "IT",
    "year": "2022"
  }'
```

**Response:**
```json
{
  "message": "Student updated successfully",
  "student": {
    "id": 1234567890,
    "name": "John Updated",
    "usn": "1MS21CS001",
    "department": "IT",
    "year": "2022",
    "email": "john@example.com"
  }
}
```

### 4. Delete Student
```bash
curl -X DELETE http://localhost:5000/students/delete/1234567890
```

**Response:**
```json
{
  "message": "Student deleted successfully"
}
```

### 5. Upload Additional Images
```bash
curl -X POST http://localhost:5000/students/upload-image/1MS21CS001 \
  -F "images=@/path/to/photo3.jpg" \
  -F "images=@/path/to/photo4.jpg"
```

**Response:**
```json
{
  "message": "Images uploaded successfully",
  "images": ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg"]
}
```

---

## Attendance Endpoints

### 1. Mark Attendance (Upload Group Photo)
```bash
curl -X POST http://localhost:5000/attendance/mark \
  -F "groupImage=@/path/to/group-photo.jpg"
```

**Response:**
```json
{
  "success": true,
  "result": {
    "present": ["John Doe", "Jane Smith", "Bob Wilson"],
    "absent": ["Alice Brown", "Charlie Davis"]
  }
}
```

### 2. Get Today's Attendance
```bash
curl http://localhost:5000/attendance/today
```

**Response:**
```json
{
  "attendance": [
    {
      "date": "2024-11-22T10:30:00.000Z",
      "groupImage": "uploads/group/1234567890-group.jpg",
      "present": ["John Doe", "Jane Smith"],
      "absent": ["Alice Brown"]
    }
  ]
}
```

### 3. Get All Attendance History
```bash
curl http://localhost:5000/attendance/history
```

**Response:**
```json
[
  {
    "date": "2024-11-22T10:30:00.000Z",
    "groupImage": "uploads/group/1234567890-group.jpg",
    "present": ["John Doe", "Jane Smith"],
    "absent": ["Alice Brown"]
  },
  {
    "date": "2024-11-21T09:15:00.000Z",
    "groupImage": "uploads/group/1234567889-group.jpg",
    "present": ["John Doe", "Alice Brown"],
    "absent": ["Jane Smith"]
  }
]
```

### 4. Get Attendance by Date
```bash
curl http://localhost:5000/attendance/history/2024-11-22
```

**Response:**
```json
{
  "date": "2024-11-22",
  "records": [
    {
      "date": "2024-11-22T10:30:00.000Z",
      "groupImage": "uploads/group/1234567890-group.jpg",
      "present": ["John Doe", "Jane Smith"],
      "absent": ["Alice Brown"]
    }
  ]
}
```

### 5. Reset Attendance (Delete All)
```bash
curl -X DELETE http://localhost:5000/attendance/reset
```

**Response:**
```json
{
  "message": "Attendance reset successfully"
}
```

---

## Postman Collection

### Import into Postman

Create a new collection with these requests:

**1. Get All Students**
- Method: GET
- URL: `http://localhost:5000/students/all`

**2. Add Student**
- Method: POST
- URL: `http://localhost:5000/students/add`
- Body: form-data
  - name: John Doe
  - usn: 1MS21CS001
  - department: Computer Science
  - year: 2021
  - email: john@example.com
  - images: [file]

**3. Mark Attendance**
- Method: POST
- URL: `http://localhost:5000/attendance/mark`
- Body: form-data
  - groupImage: [file]

**4. Get Attendance History**
- Method: GET
- URL: `http://localhost:5000/attendance/history`

---

## Testing with JavaScript (Browser Console)

### Get All Students
```javascript
fetch('http://localhost:5000/students/all')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Add Student (without images)
```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('usn', '1MS21CS001');
formData.append('department', 'Computer Science');
formData.append('year', '2021');
formData.append('email', 'john@example.com');

fetch('http://localhost:5000/students/add', {
  method: 'POST',
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

### Get Attendance History
```javascript
fetch('http://localhost:5000/attendance/history')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Name and USN are required"
}
```

### 404 Not Found
```json
{
  "error": "Student not found"
}
```

### 500 Server Error
```json
{
  "error": "Recognition failed",
  "details": "Error message here"
}
```

---

## Testing Checklist

- [ ] Server starts without errors
- [ ] Root endpoint returns status
- [ ] Can get all students (empty array initially)
- [ ] Can add student with images
- [ ] Can update student
- [ ] Can delete student
- [ ] Can upload group photo
- [ ] Face recognition works
- [ ] Can get today's attendance
- [ ] Can get attendance history
- [ ] Can filter by date
- [ ] Can reset attendance

---

## Common Issues

**CORS Error:**
- Backend has CORS enabled
- Make sure you're not using `file://` protocol
- Use a local server for frontend

**File Upload Fails:**
- Check file size (should be reasonable)
- Verify file type (jpg, jpeg, png)
- Check uploads directory exists

**Face Recognition Fails:**
- Run `python encode_faces.py` first
- Check if encodings.pkl exists
- Verify Python dependencies installed

---

## Sample Test Data

### Student 1
```json
{
  "name": "John Doe",
  "usn": "1MS21CS001",
  "department": "Computer Science",
  "year": "2021",
  "email": "john@example.com"
}
```

### Student 2
```json
{
  "name": "Jane Smith",
  "usn": "1MS21CS002",
  "department": "Information Science",
  "year": "2021",
  "email": "jane@example.com"
}
```

### Student 3
```json
{
  "name": "Bob Wilson",
  "usn": "1MS21CS003",
  "department": "Computer Science",
  "year": "2022",
  "email": "bob@example.com"
}
```

---

**Happy Testing! 🧪**
