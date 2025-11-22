// Dummy attendance data
const attendance = [
    { name: "Aarav", reg: "CS001", status: "Present" },
    { name: "Diya", reg: "CS002", status: "Absent" },
    { name: "Kabir", reg: "CS003", status: "Present" }
];

let table = document.getElementById("attendanceTable");

attendance.forEach(a => {
    table.innerHTML += `
        <tr>
            <td>${a.name}</td>
            <td>${a.reg}</td>
            <td>${a.status}</td>
        </tr>
    `;
});
