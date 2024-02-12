const express = require('express');
const router = express.Router();
const eventDetails = require('../controllers/eventDetails');


router.get('/events/:eventId', eventDetails);

module.exports = router;