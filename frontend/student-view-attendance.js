document.addEventListener("DOMContentLoaded", () => {
  const attendance = [
    { date: "2025-11-21", status: "Present" },
    { date: "2025-11-20", status: "Present" },
    { date: "2025-11-19", status: "Absent" },
  ];

  const body = document.getElementById("attendanceBody");

  attendance.forEach(a => {
    const row = `
      <tr>
        <td>${a.date}</td>
        <td>${a.status}</td>
      </tr>
    `;
    body.innerHTML += row;
  });
});
