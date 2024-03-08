const express = require('express');
const router = express.Router();
const fetchResources = require('../controllers/fetchResources')

// Route to fetch resources by service
router.get('/resources/:serviceName', fetchResources);

module.exports = router;
