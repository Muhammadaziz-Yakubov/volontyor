const Volunteer = require('../models/Volunteer');
const Event = require('../models/Event');
const Attendance = require('../models/Attendance');

// @desc    Get dashboard statistics
// @route   GET /api/statistics
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const totalVolunteers = await Volunteer.countDocuments();
    const activeVolunteers = await Volunteer.countDocuments({ status: 'Active' });
    const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
    
    // Attendance rate
    const totalAttendance = await Attendance.countDocuments();
    const presentCount = await Attendance.countDocuments({ status: 'Present' });
    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    // Attendance statistics (grouped by status)
    const attendanceStats = await Attendance.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Volunteers by Gender
    const genderStats = await Volunteer.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent events
    const recentEvents = await Event.find().sort({ date: -1 }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalVolunteers,
        activeVolunteers,
        upcomingEvents,
        attendanceRate,
        attendanceStats,
        genderStats,
        recentEvents,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
