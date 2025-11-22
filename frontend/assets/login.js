function login() {
    const role = document.getElementById("roleSelect").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    // Temporary logic — adjust later when connecting backend
    if (role === "admin") {
        window.location.href = "admin-dashboard.html";
    } else {
        window.location.href = "student-dashboard.html";
    }
}
