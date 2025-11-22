# 🚀 Quick Start Guide

Get your Smart Attendance System running in 5 minutes!

## Prerequisites
- ✅ Node.js installed
- ✅ Python 3.x installed
- ✅ pip installed

## Installation (3 Steps)

### Step 1: Backend Setup (2 minutes)
```bash
cd backend
npm install
npm run setup
npm start
```

✅ Backend running at: http://localhost:5000

### Step 2: Python Dependencies (1 minute)
```bash
pip install face_recognition opencv-python numpy pillow
```

### Step 3: Frontend (30 seconds)
```bash
cd frontend
python -m http.server 8080
```

✅ Frontend running at: http://localhost:8080

## Login & Test

### 1. Open Browser
Go to: http://localhost:8080

### 2. Login as Admin
- Username: `admin`
- Password: `admin123`

### 3. Add a Student
1. Click "Manage Students"
2. Click "Add Student"
3. Fill details and upload 3-5 face photos
4. Click "Save"

### 4. Encode Faces (Important!)
```bash
cd backend/python
python encode_faces.py
```

### 5. Mark Attendance
1. Go to "Mark Attendance"
2. Upload a group photo
3. See recognized faces!

## That's It! 🎉

Your system is ready to use.

## Quick Commands

```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && python -m http.server 8080

# Encode faces (after adding students)
cd backend/python && python encode_faces.py
```

## Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Student | student | student123 |

## Folder Structure

```
📁 Project Root
├── 📁 backend/          → Node.js API
│   ├── 📁 data/         → JSON database
│   ├── 📁 python/       → Face recognition
│   ├── 📁 uploads/      → Student images
│   └── index.js         → Main server
│
├── 📁 frontend/         → Web interface
│   ├── 📁 admin/        → Admin pages
│   ├── 📁 student/      → Student pages
│   ├── config.js        → API config
│   └── index.html       → Login page
│
└── 📁 images/           → Sample images
```

## Troubleshooting

**Backend won't start?**
```bash
cd backend
npm run setup
npm start
```

**Face recognition not working?**
```bash
cd backend/python
python encode_faces.py
```

**Frontend not loading?**
- Check if backend is running on port 5000
- Open browser console (F12) for errors

## Next Steps

1. ✅ Read [README.md](README.md) for full documentation
2. ✅ Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
3. ✅ Review [IMPROVEMENTS.md](IMPROVEMENTS.md) for features

## Need Help?

Check the documentation files:
- `README.md` - Complete documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `IMPROVEMENTS.md` - Features and changes
- `QUICK_START.md` - This file

---

**Happy Coding! 🎓📸**
