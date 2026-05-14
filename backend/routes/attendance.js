const express = require('express');
const {
  markAttendance,
  getEventAttendance,
  getVolunteerAttendance,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', markAttendance);
router.get('/event/:eventId', getEventAttendance);
router.get('/volunteer/:volunteerId', getVolunteerAttendance);

module.exports = router;
