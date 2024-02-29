const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware');
const editTask = require('../controllers/editTask')

// Route to handle updating event details and attendees
router.post('/editTask/:taskId', isAuthenticated, editTask );

module.exports = router;
