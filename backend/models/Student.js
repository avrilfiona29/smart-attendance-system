const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  usn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  department: {
    type: String,
    trim: true,
  },
  year: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    default: function () {
      return this.usn; // default password = USN
    },
  },
  // Each image object has a Cloudinary URL and public_id (for deletion)
  images: [
    {
      url: { type: String },
      public_id: { type: String },
      filename: { type: String }, // original filename for reference
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
