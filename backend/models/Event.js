const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add event title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add event description'],
  },
  date: {
    type: Date,
    required: [true, 'Please add event date'],
  },
  location: {
    type: String,
    required: [true, 'Please add event location'],
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
  }],
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming',
  },
  image: {
    type: String,
    default: 'default-event.png',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);
