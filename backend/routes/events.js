const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  addParticipant,
  removeParticipant,
} = require('../controllers/eventController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/:id/participants', addParticipant);
router.delete('/:id/participants/:volunteerId', removeParticipant);

router.route('/')
  .get(getEvents)
  .post(createEvent);

router.route('/:id')
  .get(getEvent)
  .put(updateEvent)
  .delete(deleteEvent);

module.exports = router;
