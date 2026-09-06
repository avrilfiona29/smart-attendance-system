const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for student face images
const studentImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'smart-attendance/students',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

// Storage for group attendance photos
const groupPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'smart-attendance/group-photos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'jfif'],
  },
});

const uploadStudentImages = multer({ storage: studentImageStorage });
const uploadGroupPhoto = multer({ storage: groupPhotoStorage });

module.exports = { cloudinary, uploadStudentImages, uploadGroupPhoto };
