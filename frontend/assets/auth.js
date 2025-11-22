function loginAsAdmin() {
    localStorage.setItem("role", "admin");
    window.location.href = "admin-dashboard.html";
}

function loginAsStudent() {
    localStorage.setItem("role", "student");
    window.location.href = "student-dashboard.html";
}
