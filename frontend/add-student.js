document.getElementById("addStudentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("studentName").value;
    const reg = document.getElementById("studentReg").value;
    const className = document.getElementById("studentClass").value;
    const image = document.getElementById("studentImage").files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("reg", reg);
    formData.append("class", className);
    formData.append("image", image);

    alert("✨ Student Added (Frontend Only)\nBackend API will be connected later!");
});
