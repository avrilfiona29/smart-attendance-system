// Dummy frontend-only data — backend later
const dummyStudents = [
    { id: 1, name: "Aarav", reg: "CS001", class: "CSE-A" },
    { id: 2, name: "Diya", reg: "CS002", class: "CSE-A" },
    { id: 3, name: "Kabir", reg: "CS003", class: "CSE-B" }
];

let table = document.getElementById("studentsTable");

dummyStudents.forEach(s => {
    table.innerHTML += `
        <tr>
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.reg}</td>
            <td>${s.class}</td>
        </tr>
    `;
});
