const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add full name'],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
  age: {
    type: Number,
    required: [true, 'Please add age'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Please select gender'],
  },
  address: {
    type: String,
    required: [true, 'Please add address'],
  },
  skills: [String],
  role: {
    type: String,
    required: [true, 'Please add a role'],
    default: 'Volunteer',
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave'],
    default: 'Active',
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  attendanceCount: {
    type: Number,
    default: 0,
  },
  notes: String,
  profileImage: {
    type: String,
    default: 'default-profile.png',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
