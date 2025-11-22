# Smart Attendance System

A face recognition-based attendance system using Node.js, Express, and Python for facial recognition.

## Features

### Admin Features
- ✅ Add, edit, and delete students
- ✅ Upload student images for face recognition
- ✅ Mark attendance using group photos
- ✅ View attendance history
- ✅ Filter attendance by date
- ✅ Dashboard with statistics

### Student Features
- ✅ View personal attendance records
- ✅ View attendance summary and percentage
- ✅ Profile management

## Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Font Awesome Icons

**Backend:**
- Node.js
- Express.js
- Multer (file uploads)
- Python (face recognition)

**Storage:**
- JSON-based file storage

## Project Structure

```
├── backend/
│   ├── controllers/       # Business logic
│   ├── data/             # JSON database files
│   ├── middleware/       # Multer upload config
│   ├── models/           # Data models
│   ├── python/           # Face recognition scripts
│   ├── routes/           # API routes
│   ├── uploads/          # Student images
│   ├── group_photos/     # Group photos for attendance
│   └── index.js          # Main server file
│
├── frontend/
│   ├── admin/            # Admin pages
│   │   ├── dashboard.html
│   │   ├── students.html
│   │   ├── attendance.html
│   │   └── attendance-history.html
│   ├── student/          # Student pages
│   │   ├── dashboard.html
│   │   ├── attendance.html
│   │   └── profile.html
│   ├── config.js         # API configuration
│   ├── styles.css        # Global styles
│   └── index.html        # Login page
│
└── images/               # Sample images for testing

```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- Python 3.x
- pip (Python package manager)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
pip install face_recognition opencv-python numpy pillow
```

4. Create required directories:
```bash
mkdir -p data uploads uploads/group known_faces group_photos
```

5. Initialize data files:
```bash
echo "[]" > data/students.json
echo "[]" > data/attendance.json
```

6. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open `frontend/index.html` in a browser, or use a local server:

Using Python:
```bash
cd frontend
python -m http.server 8080
```

Using Node.js (http-server):
```bash
npm install -g http-server
cd frontend
http-server -p 8080
```

Access the application at `http://localhost:8080`

## Default Login Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**Student:**
- Username: `student`
- Password: `student123`

## API Endpoints

### Students
- `POST /students/add` - Add new student with images
- `GET /students/all` - Get all students
- `PUT /students/update/:id` - Update student info
- `DELETE /students/delete/:id` - Delete student
- `POST /students/upload-image/:usn` - Upload additional images

### Attendance
- `POST /attendance/mark` - Mark attendance with group photo
- `GET /attendance/today` - Get today's attendance
- `GET /attendance/history` - Get all attendance records
- `GET /attendance/history/:date` - Get attendance by date
- `DELETE /attendance/reset` - Reset attendance data

## Usage Guide

### Adding Students

1. Login as Admin
2. Go to "Manage Students"
3. Click "Add Student"
4. Fill in student details (Name, USN, Department, Year, Email)
5. Upload 3-5 clear face images
6. Click "Save Student"

### Marking Attendance

1. Login as Admin
2. Go to "Mark Attendance"
3. Upload a group photo containing students
4. The system will automatically recognize faces
5. View the list of present and absent students

### Viewing Attendance

**Admin:**
- View complete attendance history
- Filter by date
- See detailed reports

**Student:**
- View personal attendance records
- Check attendance percentage
- See present/absent status

## Python Face Recognition

The system uses the following Python scripts:

- `encode_faces.py` - Encodes student faces from uploaded images
- `recognize.py` - Recognizes faces in group photos
- `test_recognition.py` - Tests face recognition

Make sure to run `encode_faces.py` after adding new students to update the face encodings.

## Configuration

Edit `frontend/config.js` to change the API base URL:

```javascript
const API_BASE_URL = 'http://localhost:5000';
```

## Troubleshooting

**Backend not starting:**
- Check if port 5000 is available
- Verify all dependencies are installed
- Check if data directory and JSON files exist

**Face recognition not working:**
- Ensure Python dependencies are installed
- Check if face encodings are generated
- Verify image quality (clear, well-lit faces)

**CORS errors:**
- Make sure backend CORS is enabled
- Check API_BASE_URL in config.js

## Future Enhancements

- [ ] Real authentication with JWT
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Email notifications
- [ ] Export attendance to Excel/PDF
- [ ] Mobile app
- [ ] Real-time attendance updates
- [ ] Multiple class/section support

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.
