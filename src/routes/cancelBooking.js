const express = require('express');
const cancelBooking = require('../controllers/cancelBooking');
const router = express.Router();


router.put('/cancel-booking/:bookingId', cancelBooking);

module.exports = router;
