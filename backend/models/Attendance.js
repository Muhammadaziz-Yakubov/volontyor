const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late'],
    required: true,
  },
  notes: String,
}, {
  timestamps: true,
});

// Compound index to prevent duplicate attendance for same volunteer at same event
attendanceSchema.index({ volunteer: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
