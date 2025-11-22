import face_recognition
import os
import pickle
import json

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SCRIPT_DIR)

# Paths
UPLOADS_DIR = os.path.join(BACKEND_DIR, "uploads")
STUDENTS_JSON = os.path.join(BACKEND_DIR, "data", "students.json")
ENCODINGS_FILE = os.path.join(SCRIPT_DIR, "encodings.pkl")

print(f"[INFO] Backend directory: {BACKEND_DIR}")
print(f"[INFO] Uploads directory: {UPLOADS_DIR}")
print(f"[INFO] Students JSON: {STUDENTS_JSON}")
print(f"[INFO] Encodings file: {ENCODINGS_FILE}\n")

known_encodings = []
known_names = []

# Check if students.json exists
if not os.path.exists(STUDENTS_JSON):
    print("[ERROR] students.json not found!")
    print("Please add students first using the admin panel.")
    exit(1)

# Load students from JSON
with open(STUDENTS_JSON, 'r') as f:
    students = json.load(f)

if len(students) == 0:
    print("[WARNING] No students found in database!")
    print("Please add students first using the admin panel.")
    exit(0)

print(f"[INFO] Found {len(students)} students in database\n")

# Process each student
for student in students:
    student_name = student.get('name', 'Unknown')
    student_images = student.get('images', [])
    
    if len(student_images) == 0:
        print(f"[WARNING] {student_name} has no images, skipping...")
        continue
    
    print(f"[INFO] Processing {student_name} ({len(student_images)} images)")
    
    for img_filename in student_images:
        img_path = os.path.join(UPLOADS_DIR, img_filename)
        
        if not os.path.exists(img_path):
            print(f" → [WARNING] Image not found: {img_filename}")
            continue
        
        try:
            image = face_recognition.load_image_file(img_path)
            encodings = face_recognition.face_encodings(image)
            
            if len(encodings) > 0:
                known_encodings.append(encodings[0])
                known_names.append(student_name)
                print(f" → ✓ Encoded: {img_filename}")
            else:
                print(f" → ✗ No face found in: {img_filename}")
        except Exception as e:
            print(f" → ✗ Error processing {img_filename}: {str(e)}")

# Save encodings
if len(known_encodings) > 0:
    with open(ENCODINGS_FILE, "wb") as f:
        pickle.dump({"encodings": known_encodings, "names": known_names}, f)
    
    print(f"\n[SUCCESS] Encoding complete!")
    print(f"[INFO] Encoded {len(known_encodings)} faces from {len(set(known_names))} students")
    print(f"[INFO] Saved to: {ENCODINGS_FILE}")
else:
    print("\n[ERROR] No faces were encoded!")
    print("Please make sure:")
    print("1. Students have been added via admin panel")
    print("2. Images contain clear, visible faces")
    print("3. Images are in JPG/JPEG/PNG format")
