const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');
const rsvp = require('../controllers/rsvp')

// POST route to RSVP to an event
router.post('/events/:eventId/rsvp', isAuthenticated, rsvp);


module.exports = router;