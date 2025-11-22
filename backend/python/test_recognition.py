import face_recognition
import cv2
import numpy as np
import os
import pickle

# Load the encoded faces
with open("encodings.pkl", "rb") as f:
    encoded_data = pickle.load(f)

known_encodings = encoded_data["encodings"]
known_names = encoded_data["names"]

# Load your group image here
image = cv2.imread("group.jpg")  # <-- replace with your actual group image name/path
rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Detect faces in group photo
faces_locations = face_recognition.face_locations(rgb_image)
faces_encodings = face_recognition.face_encodings(rgb_image, faces_locations)

for face_encoding, face_location in zip(faces_encodings, faces_locations):
    matches = face_recognition.compare_faces(known_encodings, face_encoding)
    face_distances = face_recognition.face_distance(known_encodings, face_encoding)

    name = "Unknown"

    if len(face_distances) > 0:
        best_match = np.argmin(face_distances)
        if matches[best_match]:
            name = known_names[best_match]

    top, right, bottom, left = face_location
    cv2.rectangle(image, (left, top), (right, bottom), (0,255,0), 2)
    cv2.putText(image, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,0), 2)

# Save output
cv2.imwrite("output_group.jpg", image)
print("Done! Check output_group.jpg")
