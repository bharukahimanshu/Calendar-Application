const express = require('express');
const cancelBooking = require('../controllers/cancelBooking');
const router = express.Router();

// DELETE route to cancel a booking
router.delete('/cancel-booking/:bookingId', cancelBooking);

module.exports = router;
