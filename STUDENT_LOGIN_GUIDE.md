# 🎓 Student Login System Guide

## Overview

Students can now login to the system using their **USN (University Seat Number)** and password to view their personal attendance records.

---

## 🔐 How Student Login Works

### For Students

1. **Go to Login Page**: http://localhost:8080
2. **Select Role**: Choose "Student" from dropdown
3. **Enter USN**: Enter your University Seat Number (e.g., 1MS21CS001)
4. **Enter Password**: 
   - Default password is your **USN**
   - If admin set a custom password, use that
5. **Click Login**: Access your dashboard

### Default Credentials

When a student is added:
- **Username**: Their USN (e.g., 1MS21CS001)
- **Default Password**: Same as USN (e.g., 1MS21CS001)
- Admin can set a custom password during registration

---

## 👨‍💼 For Administrators

### Adding Students with Login Access

1. **Login as Admin**
2. **Go to "Manage Students"**
3. **Click "Add Student"**
4. **Fill in Details**:
   - Name: Student's full name
   - USN: University Seat Number (this becomes their username)
   - Department: e.g., Computer Science
   - Year: e.g., 2024
   - Email: Student's email
   - **Password (Optional)**: 
     - Leave empty to use USN as password
     - Or set a custom password
   - Upload 3-5 face images

5. **Click "Save Student"**

### Password Rules

- **If password field is empty**: USN becomes the password
- **If password is provided**: That password is used
- **Example**:
  - USN: 1MS21CS001
  - Password field empty → Password: 1MS21CS001
  - Password field: "student123" → Password: student123

---

## 🎯 Student Portal Features

Once logged in, students can:

### 1. Dashboard
- View attendance summary
- See total days present
- See total days absent
- Check attendance percentage

### 2. My Attendance
- View complete attendance history
- See date and time of each record
- Check Present/Absent status

### 3. My Profile
- View personal information
- See USN, Department, Year, Email
- Contact admin for updates

---

## 🔄 Login Flow

```
Student Opens Login Page
        ↓
Selects "Student" Role
        ↓
Label changes to "USN"
        ↓
Enters USN (e.g., 1MS21CS001)
        ↓
Enters Password (default: same as USN)
        ↓
Clicks Login
        ↓
Backend validates USN and Password
        ↓
If valid: Redirect to Student Dashboard
If invalid: Show error message
```

---

## 🔧 Technical Details

### Backend API

**Endpoint**: `POST /auth/student-login`

**Request Body**:
```json
{
  "usn": "1MS21CS001",
  "password": "1MS21CS001"
}
```

**Success Response** (200):
```json
{
  "message": "Login successful",
  "student": {
    "id": 1234567890,
    "name": "John Doe",
    "usn": "1MS21CS001",
    "department": "Computer Science",
    "year": "2024",
    "email": "john@example.com",
    "images": ["image1.jpg", "image2.jpg"]
  }
}
```

**Error Response** (404):
```json
{
  "error": "Student not found"
}
```

**Error Response** (401):
```json
{
  "error": "Invalid password"
}
```

### Frontend Storage

After successful login, the following is stored in `sessionStorage`:
- `userRole`: "student"
- `studentData`: Complete student object (JSON)
- `username`: Student's name
- `usn`: Student's USN

---

## 📝 Example Scenarios

### Scenario 1: First Time Login

**Student**: John Doe  
**USN**: 1MS21CS001  
**Admin Action**: Added student without custom password

**Login Credentials**:
- USN: `1MS21CS001`
- Password: `1MS21CS001` (same as USN)

### Scenario 2: Custom Password

**Student**: Jane Smith  
**USN**: 1MS21CS002  
**Admin Action**: Set password as "jane2024"

**Login Credentials**:
- USN: `1MS21CS002`
- Password: `jane2024`

### Scenario 3: Multiple Students

| Name | USN | Password (if custom) |
|------|-----|---------------------|
| John Doe | 1MS21CS001 | 1MS21CS001 (default) |
| Jane Smith | 1MS21CS002 | jane2024 (custom) |
| Bob Wilson | 1MS21CS003 | 1MS21CS003 (default) |

---

## 🔒 Security Features

1. **Backend Validation**: All login attempts validated on server
2. **Session Management**: User data stored in sessionStorage
3. **Role-Based Access**: Students can only access student portal
4. **Password Protection**: Each student has unique credentials
5. **Auto Logout**: Session cleared on logout

---

## 🐛 Troubleshooting

### "Student not found"
- **Cause**: USN doesn't exist in database
- **Solution**: Check if student is registered. Contact admin.

### "Invalid password"
- **Cause**: Wrong password entered
- **Solution**: 
  - Try using USN as password (default)
  - Contact admin if custom password was set

### "Login failed. Please check if backend is running"
- **Cause**: Backend server not running
- **Solution**: 
  ```bash
  cd backend
  npm start
  ```

### Can't see attendance records
- **Cause**: No attendance marked yet
- **Solution**: Wait for admin to mark attendance

---

## 🎓 For Students: How to Use

### Step 1: Get Your Credentials
- Your **USN** is your username
- Your **password** is either:
  - Your USN (default)
  - A custom password (ask admin)

### Step 2: Login
1. Go to: http://localhost:8080
2. Select "Student"
3. Enter your USN
4. Enter your password
5. Click Login

### Step 3: View Dashboard
- See your attendance summary
- Check your attendance percentage
- View present/absent days

### Step 4: Check Attendance
- Click "My Attendance"
- See all your attendance records
- Check dates and status

### Step 5: View Profile
- Click "My Profile"
- See your details
- Contact admin for changes

---

## 📊 Admin Dashboard vs Student Dashboard

| Feature | Admin | Student |
|---------|-------|---------|
| Add Students | ✅ | ❌ |
| Edit Students | ✅ | ❌ |
| Delete Students | ✅ | ❌ |
| Mark Attendance | ✅ | ❌ |
| View All Attendance | ✅ | ❌ |
| View Own Attendance | ❌ | ✅ |
| View Own Profile | ❌ | ✅ |
| Attendance Percentage | ✅ (All) | ✅ (Own) |

---

## 🔄 Password Management (Future Enhancement)

Currently, passwords are set by admin. Future features could include:
- Student password change
- Forgot password functionality
- Email verification
- Password strength requirements

---

## ✅ Testing Checklist

### Admin Side
- [ ] Add student without password (uses USN)
- [ ] Add student with custom password
- [ ] Verify student appears in list
- [ ] Check student data is saved

### Student Side
- [ ] Login with USN and default password
- [ ] Login with USN and custom password
- [ ] View dashboard
- [ ] Check attendance records
- [ ] View profile
- [ ] Logout

### Security
- [ ] Wrong USN shows error
- [ ] Wrong password shows error
- [ ] Can't access admin pages
- [ ] Session clears on logout

---

## 📞 Support

**For Students**:
- Can't login? Contact your administrator
- Forgot password? Contact your administrator
- Wrong attendance? Contact your administrator

**For Administrators**:
- Check backend is running: `npm start`
- Check students.json has correct data
- Verify password field in student records

---

**Version**: 2.1  
**Last Updated**: November 22, 2024  
**Status**: ✅ Active
