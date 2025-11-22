const BASE_URL = "http://localhost:5000"; // change if needed

// load all students
async function loadStudents() {
  const list = document.getElementById("studentsList");
  list.innerHTML = "Loading...";

  try {
    const res = await fetch(`${BASE_URL}/students`);
    const data = await res.json();

    list.innerHTML = "";
    data.forEach(std => {
      const card = `
        <div class="col-md-4">
          <div class="card shadow-sm">
            <img src="${std.image || 'https://via.placeholder.com/200'}" class="card-img-top" style="height:200px; object-fit:cover;">
            <div class="card-body">
              <h5>${std.name}</h5>
              <p>Roll: ${std.roll}</p>
              <button class="btn btn-success btn-sm" onclick="markAttendance('${std.roll}')">Mark Present</button>
            </div>
          </div>
        </div>`;
      list.innerHTML += card;
    });
  } catch (err) {
    list.innerHTML = "Error loading students.";
  }
}

// add new student
document.getElementById("addStudentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fd = new FormData();
  fd.append("name", document.getElementById("name").value);
  fd.append("roll", document.getElementById("roll").value);
  fd.append("image", document.getElementById("image").files[0]);

  const res = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    body: fd
  });

  if (res.ok) {
    alert("Student added!");
    loadStudents();
  } else {
    alert("Failed to add student");
  }
});

// mark attendance
async function markAttendance(roll) {
  const res = await fetch(`${BASE_URL}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roll })
  });

  if (res.ok) {
    alert("Attendance marked!");
  } else {
    alert("Failed to mark attendance.");
  }
}

loadStudents();
