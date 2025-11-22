#!/usr/bin/env python
import face_recognition
import cv2
import pickle
import sys
import os
import json
import numpy as np

# Path to encodings file (update if your file name differs)
ENCODINGS_PATH = os.path.join(os.path.dirname(__file__), "encodings.pkl")

def load_encodings():
    with open(ENCODINGS_PATH, "rb") as f:
        data = pickle.load(f)
    # Expect data to have "encodings" and "names" lists or encodings/names structure
    # handle two forms: {"encodings": [...], "names":[...]} or {"encodings": [...], "names":[...]}
    if isinstance(data, dict):
        # common keys used earlier: "encodings" and "names" OR "encodings" and "names"
        encs = data.get("encodings") or data.get("encodings", [])
        names = data.get("names") or data.get("names", [])
        # fallback older format:
        if not encs and "encodings" in data:
            encs = data["encodings"]
            names = data["names"]
        return encs, names
    # fallback: list of encodings / names (not expected)
    return data.get("encodings", []), data.get("names", [])

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error":"no image path provided"}))
        return

    group_image_path = sys.argv[1]
    if not os.path.exists(group_image_path):
        print(json.dumps({"error":"image not found"}))
        return

    # load known encodings
    try:
        known_encodings, known_names = load_encodings()
    except Exception as e:
        print(json.dumps({"error":"failed to load encodings", "details": str(e)}))
        return

    # load group image
    image = face_recognition.load_image_file(group_image_path)
    # detect faces
    locations = face_recognition.face_locations(image, model="hog")  # or "cnn" if you prefer and have GPU
    encodings = face_recognition.face_encodings(image, locations)

    present = []
    # For each detected face, compare with known encodings
    for face_encoding in encodings:
        matches = face_recognition.compare_faces(known_encodings, face_encoding, tolerance=0.5)
        face_distances = face_recognition.face_distance(known_encodings, face_encoding)

        name = None
        if any(matches):
            # pick best match
            best_idx = np.argmin(face_distances)
            name = known_names[best_idx]
        else:
            name = "Unknown"

        # only add if not Unknown
        if name != "Unknown":
            present.append(name)

    # Determine absent list (all known_names not in present)
    unique_present = list(dict.fromkeys(present))  # dedupe preserv order
    absent = [n for n in sorted(set(known_names)) if n not in unique_present]

    # Output JSON to stdout (Node will read this)
    out = {"present": unique_present, "absent": absent}
    print(json.dumps(out))

if __name__ == "__main__":
    main()
