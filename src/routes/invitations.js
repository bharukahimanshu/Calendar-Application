// Import required modules
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Event = require('../models/events');
const invitations = require('../controllers/invitation')

// Endpoint to fetch event invitations for the current user
router.get('/invitations', invitations);

// Export the router
module.exports = router;
