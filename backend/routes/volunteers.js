const express = require('express');
const {
  getVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  exportVolunteers,
} = require('../controllers/volunteerController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/export', protect, exportVolunteers);
router.use(protect); // Protect all routes in this file

router.route('/')
  .get(getVolunteers)
  .post(createVolunteer);

router.route('/:id')
  .get(getVolunteer)
  .put(updateVolunteer)
  .delete(deleteVolunteer);

module.exports = router;
