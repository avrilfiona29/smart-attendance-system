document.getElementById("groupForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const img = document.getElementById("groupImage").files[0];

    alert("📸 Group Photo Uploaded (Frontend Only)\nBackend YOLO endpoint will be added later!");
});
