const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');
const deleteEvent = require('../controllers/deleteEvent')

// Route to handle deleting an event
router.delete('/delete/:eventId', isAuthenticated, deleteEvent);

module.exports = router;
