---
title: Smart Attendance Face Recognition
emoji: 👤
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---

# Smart Attendance - Face Recognition API

A FastAPI service that performs face recognition on group photos.

## Endpoints

- `GET /` - Health check
- `POST /recognize` - Upload a group photo, returns present/absent lists
