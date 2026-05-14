const Attendance = require('../models/Attendance');
const Volunteer = require('../models/Volunteer');

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private
exports.markAttendance = async (req, res) => {
  try {
    const { volunteer, event, status, notes } = req.body;

    const attendance = await Attendance.create({
      volunteer,
      event,
      status,
      notes,
    });

    // Increment attendance count for volunteer if status is Present
    if (status === 'Present') {
      await Volunteer.findByIdAndUpdate(volunteer, {
        $inc: { attendanceCount: 1 }
      });
    }

    res.status(201).json({ success: true, data: attendance });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get attendance history for an event
// @route   GET /api/attendance/event/:eventId
// @access  Private
exports.getEventAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ event: req.params.eventId }).populate('volunteer');
    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get attendance history for a volunteer
// @route   GET /api/attendance/volunteer/:volunteerId
// @access  Private
exports.getVolunteerAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ volunteer: req.params.volunteerId }).populate('event');
    res.status(200).json({ success: true, count: attendance.length, data: attendance });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
