const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');
const editEvents = require('../controllers/editEvents')

// Route to handle updating event details and attendees
router.post('/editEvent/:eventId', isAuthenticated, editEvents );

module.exports = router;
