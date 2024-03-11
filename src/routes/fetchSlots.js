const express = require('express');
const router = express.Router();
const availableTimeSlots = require('../controllers/fetchSlots');

// Function to generate available time slots for a specific date and resource
router.get('/availableTimeSlots/:serviceId/:resourceId/:date', availableTimeSlots);

module.exports = router;


