const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  groupImage: {
    url: { type: String },
    public_id: { type: String },
  },
  present: [{ type: String }],
  absent: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
