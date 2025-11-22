# System Architecture

## Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐       │
│  │   Admin Portal   │              │  Student Portal  │       │
│  │                  │              │                  │       │
│  │  • Dashboard     │              │  • Dashboard     │       │
│  │  • Students      │              │  • Attendance    │       │
│  │  • Attendance    │              │  • Profile       │       │
│  │  • History       │              │                  │       │
│  └──────────────────┘              └──────────────────┘       │
│           │                                  │                 │
└───────────┼──────────────────────────────────┼─────────────────┘
            │                                  │
            └──────────────┬───────────────────┘
                           │
                    HTTP/REST API
                           │
┌──────────────────────────┼──────────────────────────────────────┐
│                    BACKEND SERVER                               │
│                    (Node.js/Express)                            │
│                          │                                      │
│  ┌───────────────────────┴────────────────────────┐           │
│  │                                                 │           │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────┴──────┐    │
│  │  │   Routes    │  │ Controllers  │  │   Middleware  │    │
│  │  │             │  │              │  │               │    │
│  │  │ • Students  │→ │ • Student    │  │ • Multer      │    │
│  │  │ • Attendance│→ │   Logic      │  │ • Upload      │    │
│  │  │ • Upload    │  │ • Attendance │  │ • CORS        │    │
│  │  └─────────────┘  │   Logic      │  └───────────────┘    │
│  │                   └──────────────┘                        │
│  │                          │                                │
│  │                   ┌──────┴───────┐                       │
│  │                   │    Models    │                       │
│  │                   │              │                       │
│  │                   │ • Student    │                       │
│  │                   │   Model      │                       │
│  │                   └──────────────┘                       │
│  └────────────────────────┬──────────────────────────────────┘
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
    ┌──────────────┐ ┌──────────┐  ┌──────────────┐
    │   Storage    │ │  Python  │  │   Uploads    │
    │              │ │  Scripts │  │              │
    │ • students   │ │          │  │ • Student    │
    │   .json      │ │ • encode │  │   Images     │
    │              │ │   _faces │  │              │
    │ • attendance │ │   .py    │  │ • Group      │
    │   .json      │ │          │  │   Photos     │
    │              │ │ • recog  │  │              │
    │              │ │   nize.py│  │              │
    └──────────────┘ └──────────┘  └──────────────┘
```

## Data Flow

### 1. Student Registration Flow

```
Admin → Add Student Form → Upload Images
                ↓
        Backend API (POST /students/add)
                ↓
        Multer Middleware (Save Images)
                ↓
        Student Controller (Process Data)
                ↓
        Student Model (Save to JSON)
                ↓
        students.json Updated
                ↓
        Response to Frontend
                ↓
        Success Message Displayed
```

### 2. Face Encoding Flow

```
Admin Adds Students with Images
                ↓
        Images Saved in /uploads
                ↓
    Run: python encode_faces.py
                ↓
        Read all images from /uploads
                ↓
        Extract face encodings
                ↓
        Save to encodings.pkl
                ↓
        Ready for Recognition
```

### 3. Attendance Marking Flow

```
Admin → Upload Group Photo
                ↓
        Backend API (POST /attendance/mark)
                ↓
        Multer Middleware (Save Photo)
                ↓
        Spawn Python Process (recognize.py)
                ↓
        Load encodings.pkl
                ↓
        Detect faces in group photo
                ↓
        Compare with known encodings
                ↓
        Generate Present/Absent Lists
                ↓
        Return JSON Result
                ↓
        Save to attendance.json
                ↓
        Display Results to Admin
```

### 4. Student View Attendance Flow

```
Student → Login → Dashboard
                ↓
        View Attendance Page
                ↓
        Backend API (GET /attendance/history)
                ↓
        Read attendance.json
                ↓
        Filter by student username
                ↓
        Calculate statistics
                ↓
        Return filtered data
                ↓
        Display in table format
```

## Component Interaction

### Frontend Components

```
┌─────────────────────────────────────────┐
│           Frontend (Browser)            │
│                                         │
│  ┌────────────────────────────────┐    │
│  │         config.js              │    │
│  │  • API_BASE_URL                │    │
│  │  • API endpoints               │    │
│  │  • apiCall() helper            │    │
│  └────────────────────────────────┘    │
│                 │                       │
│  ┌──────────────┴──────────────┐       │
│  │                             │       │
│  ▼                             ▼       │
│ Admin Pages              Student Pages │
│  • dashboard.html         • dashboard  │
│  • students.html          • attendance │
│  • attendance.html        • profile    │
│  • history.html                        │
│                                         │
│  All use: styles.css (Global Styles)   │
└─────────────────────────────────────────┘
```

### Backend Components

```
┌─────────────────────────────────────────┐
│        Backend (Node.js/Express)        │
│                                         │
│  ┌────────────────────────────────┐    │
│  │         index.js               │    │
│  │  • Express setup               │    │
│  │  • Middleware config           │    │
│  │  • Route registration          │    │
│  │  • Server start                │    │
│  └────────────────────────────────┘    │
│                 │                       │
│  ┌──────────────┼──────────────┐       │
│  │              │              │       │
│  ▼              ▼              ▼       │
│ Routes      Controllers    Middleware  │
│  • Define    • Business     • Multer   │
│    endpoints   logic        • Upload   │
│  • Handle    • Data         • CORS     │
│    requests    processing              │
│              • Validation              │
│                 │                       │
│                 ▼                       │
│              Models                     │
│              • Data access              │
│              • JSON I/O                 │
└─────────────────────────────────────────┘
```

## File System Structure

```
Project Root
│
├── backend/
│   ├── controllers/
│   │   └── studentController.js
│   │
│   ├── data/
│   │   ├── students.json        [Student records]
│   │   └── attendance.json      [Attendance records]
│   │
│   ├── middleware/
│   │   └── studentUpload.js     [Multer config]
│   │
│   ├── models/
│   │   └── studentModel.js      [Data operations]
│   │
│   ├── python/
│   │   ├── encode_faces.py      [Create encodings]
│   │   ├── recognize.py         [Face recognition]
│   │   ├── test_recognition.py  [Testing]
│   │   └── encodings.pkl        [Face data]
│   │
│   ├── routes/
│   │   ├── studentRoutes.js     [Student APIs]
│   │   ├── attendance.js        [Attendance APIs]
│   │   ├── groupUpload.js       [Upload APIs]
│   │   └── studentList.js       [List APIs]
│   │
│   ├── uploads/
│   │   ├── [student images]
│   │   └── group/
│   │       └── [group photos]
│   │
│   ├── index.js                 [Main server]
│   ├── setup.js                 [Setup script]
│   └── package.json             [Dependencies]
│
└── frontend/
    ├── admin/
    │   ├── dashboard.html
    │   ├── students.html
    │   ├── attendance.html
    │   └── attendance-history.html
    │
    ├── student/
    │   ├── dashboard.html
    │   ├── attendance.html
    │   └── profile.html
    │
    ├── config.js                [API config]
    ├── styles.css               [Global styles]
    └── index.html               [Login page]
```

## Technology Stack Layers

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  HTML5 | CSS3 | JavaScript | Bootstrap  │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         Application Layer               │
│    Node.js | Express.js | Multer        │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         Business Logic Layer            │
│  Controllers | Models | Middleware      │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         Data Layer                      │
│  JSON Files | File System               │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         AI/ML Layer                     │
│  Python | face_recognition | OpenCV     │
└─────────────────────────────────────────┘
```

## API Request/Response Flow

### Example: Add Student

```
1. User Action
   ↓
   Admin fills form and uploads images
   ↓
2. Frontend
   ↓
   JavaScript creates FormData
   fetch(API.students.add, { method: 'POST', body: formData })
   ↓
3. Network
   ↓
   HTTP POST to http://localhost:5000/students/add
   ↓
4. Backend - Express
   ↓
   Route: router.post('/add', ...)
   ↓
5. Backend - Middleware
   ↓
   Multer processes file uploads
   Saves images to /uploads
   ↓
6. Backend - Controller
   ↓
   Validates data
   Processes request
   ↓
7. Backend - Model
   ↓
   Reads students.json
   Adds new student
   Writes students.json
   ↓
8. Backend - Response
   ↓
   Returns JSON: { message: "Success", student: {...} }
   ↓
9. Frontend
   ↓
   Receives response
   Updates UI
   Shows success message
```

## Security Flow

```
┌─────────────────────────────────────────┐
│              User Login                 │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Session Storage                 │
│  • userRole (admin/student)             │
│  • username                             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Page Access Check               │
│  if (role !== 'admin') redirect         │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         API Requests                    │
│  (Future: Add JWT tokens)               │
└─────────────────────────────────────────┘
```

## Deployment Architecture (Future)

```
┌─────────────────────────────────────────┐
│            Load Balancer                │
└─────────────────────────────────────────┘
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
┌──────────────┐        ┌──────────────┐
│  Frontend    │        │  Frontend    │
│  Server 1    │        │  Server 2    │
└──────────────┘        └──────────────┘
        │                       │
        └───────────┬───────────┘
                    ↓
┌─────────────────────────────────────────┐
│            API Gateway                  │
└─────────────────────────────────────────┘
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
┌──────────────┐        ┌──────────────┐
│  Backend     │        │  Backend     │
│  Server 1    │        │  Server 2    │
└──────────────┘        └──────────────┘
        │                       │
        └───────────┬───────────┘
                    ↓
┌─────────────────────────────────────────┐
│            Database                     │
│  (MongoDB/PostgreSQL)                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         File Storage (S3/Cloud)         │
└─────────────────────────────────────────┘
```

## Performance Considerations

### Current Setup
- **Frontend:** Static files (fast)
- **Backend:** Single Node.js process
- **Storage:** JSON files (simple, fast for small data)
- **Face Recognition:** Python subprocess (blocking)

### Optimization Opportunities
1. **Caching:** Add Redis for frequently accessed data
2. **Database:** Move to MongoDB/PostgreSQL for better scalability
3. **Queue:** Use Bull/RabbitMQ for face recognition jobs
4. **CDN:** Serve static assets via CDN
5. **Clustering:** Use PM2 for multi-process Node.js

## Monitoring Points

```
Frontend Metrics:
• Page load time
• API response time
• Error rate

Backend Metrics:
• Request rate
• Response time
• Error rate
• CPU usage
• Memory usage

Python Process:
• Recognition time
• Success rate
• Error rate
```

---

This architecture provides a solid foundation for a smart attendance system with room for future enhancements and scaling.
