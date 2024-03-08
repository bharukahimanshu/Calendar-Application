const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');
const editBooking = require('../controllers/editBooking')

// Route to handle updating event details and attendees
router.post('/editTask/:taskId', isAuthenticated, editBooking );

module.exports = router;
