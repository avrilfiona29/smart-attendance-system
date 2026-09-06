from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import face_recognition
import numpy as np
import pickle
import os
import tempfile
import shutil

app = FastAPI()

ENCODINGS_PATH = os.path.join(os.path.dirname(__file__), "encodings.pkl")

def load_encodings():
    if not os.path.exists(ENCODINGS_PATH):
        return [], []
    with open(ENCODINGS_PATH, "rb") as f:
        data = pickle.load(f)
    return data.get("encodings", []), data.get("names", [])

@app.get("/")
def root():
    return {"status": "Face Recognition API is running"}

@app.post("/recognize")
async def recognize(file: UploadFile = File(...)):
    # Save uploaded file to temp location
    suffix = os.path.splitext(file.filename)[1] or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        known_encodings, known_names = load_encodings()

        if not known_encodings:
            return JSONResponse({"error": "No encodings found. Please upload encodings.pkl"})

        image = face_recognition.load_image_file(tmp_path)
        locations = face_recognition.face_locations(image, model="hog")
        encodings = face_recognition.face_encodings(image, locations)

        present = []
        for face_encoding in encodings:
            matches = face_recognition.compare_faces(known_encodings, face_encoding, tolerance=0.5)
            distances = face_recognition.face_distance(known_encodings, face_encoding)

            if any(matches):
                best_idx = np.argmin(distances)
                name = known_names[best_idx]
                if name not in present:
                    present.append(name)

        absent = [n for n in sorted(set(known_names)) if n not in present]

        return {"present": present, "absent": absent}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    finally:
        os.unlink(tmp_path)
