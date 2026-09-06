// API Configuration
// Change this to your Render backend URL after deployment
// Example: const API_BASE_URL = 'https://smart-attendance-backend.onrender.com';
const API_BASE_URL = 'http://localhost:5000';

// API Endpoints
const API = {
    // Authentication endpoints
    auth: {
        adminLogin: `${API_BASE_URL}/auth/admin-login`,
        studentLogin: `${API_BASE_URL}/auth/student-login`
    },
    // Student endpoints
    students: {
        add: `${API_BASE_URL}/students/add`,
        all: `${API_BASE_URL}/students/all`,
        update: (id) => `${API_BASE_URL}/students/update/${id}`,
        delete: (id) => `${API_BASE_URL}/students/delete/${id}`,
        uploadImages: (usn) => `${API_BASE_URL}/students/upload-image/${usn}`
    },
    // Attendance endpoints
    attendance: {
        mark: `${API_BASE_URL}/attendance/mark`,
        today: `${API_BASE_URL}/attendance/today`,
        history: `${API_BASE_URL}/attendance/history`,
        historyByDate: (date) => `${API_BASE_URL}/attendance/history/${date}`,
        reset: `${API_BASE_URL}/attendance/reset`
    }
};

// Helper function for API calls
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}
