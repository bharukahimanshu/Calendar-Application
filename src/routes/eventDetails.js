const express = require('express');
const router = express.Router();
const eventDetails = require('../controllers/eventDetails');

// GET route to retrieve event details
router.get('/events/:eventId', eventDetails);

module.exports = router;