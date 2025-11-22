# Quick Setup Guide

## Step-by-Step Installation

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run setup script (creates folders and files)
npm run setup

# Start the server
npm start
```

The backend will be available at: `http://localhost:5000`

### 2. Install Python Dependencies

```bash
pip install face_recognition opencv-python numpy pillow
```

**Note:** If you face issues installing `face_recognition`, you may need to install `cmake` and `dlib` first:

**Windows:**
```bash
pip install cmake
pip install dlib
pip install face_recognition
```

**Mac:**
```bash
brew install cmake
pip install dlib
pip install face_recognition
```

**Linux:**
```bash
sudo apt-get install cmake
pip install dlib
pip install face_recognition
```

### 3. Frontend Setup

**Option 1: Direct File Access**
- Simply open `frontend/index.html` in your browser

**Option 2: Using Python HTTP Server**
```bash
cd frontend
python -m http.server 8080
```
Then open: `http://localhost:8080`

**Option 3: Using Node.js http-server**
```bash
npm install -g http-server
cd frontend
http-server -p 8080
```
Then open: `http://localhost:8080`

## Testing the Application

### 1. Login
- Open the frontend in your browser
- Use default credentials:
  - **Admin:** username: `admin`, password: `admin123`
  - **Student:** username: `student`, password: `student123`

### 2. Add Students (Admin)
1. Login as admin
2. Click "Manage Students"
3. Click "Add Student"
4. Fill in details:
   - Name: John Doe
   - USN: 1MS21CS001
   - Department: Computer Science
   - Year: 2021
   - Email: john@example.com
5. Upload 3-5 clear face photos
6. Click "Save Student"

### 3. Encode Faces (Important!)
After adding students, run the face encoding script:

```bash
cd backend/python
python encode_faces.py
```

This creates face encodings for recognition.

### 4. Mark Attendance
1. Go to "Mark Attendance"
2. Upload a group photo containing student faces
3. The system will recognize faces and mark attendance
4. View present/absent lists

### 5. View Attendance
- **Admin:** Can view all attendance records and filter by date
- **Student:** Can view personal attendance records

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change port in backend/index.js
const PORT = process.env.PORT || 5001; // Change to 5001 or any available port
```

**Missing directories:**
```bash
cd backend
npm run setup
```

### Frontend Issues

**API not connecting:**
- Check if backend is running on port 5000
- Verify `frontend/config.js` has correct API_BASE_URL
- Check browser console for CORS errors

**CORS errors:**
- Backend already has CORS enabled
- Make sure you're accessing frontend through a server (not file://)

### Python Issues

**face_recognition not installing:**
- Install cmake and dlib first (see above)
- Use Python 3.7-3.9 (better compatibility)

**Recognition not working:**
- Ensure face encodings are generated (`python encode_faces.py`)
- Check image quality (clear, well-lit faces)
- Verify Python script paths in backend routes

## File Structure Check

After setup, your backend should have:

```
backend/
├── data/
│   ├── students.json
│   └── attendance.json
├── uploads/
│   └── group/
├── known_faces/
├── group_photos/
└── python/
    ├── encode_faces.py
    ├── recognize.py
    └── encodings.pkl (created after running encode_faces.py)
```

## Next Steps

1. ✅ Backend running on port 5000
2. ✅ Frontend accessible in browser
3. ✅ Add test students with images
4. ✅ Run face encoding script
5. ✅ Test attendance marking with group photo
6. ✅ Verify attendance records

## Common Commands

```bash
# Start backend
cd backend
npm start

# Start backend with auto-reload
npm run dev

# Setup backend
npm run setup

# Encode faces
cd backend/python
python encode_faces.py

# Start frontend (Python)
cd frontend
python -m http.server 8080
```

## Need Help?

Check the main README.md for detailed documentation and API endpoints.
