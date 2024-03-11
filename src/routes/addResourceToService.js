const express = require('express');
const addResourceToService = require('../controllers/addResourceToService');
const router = express.Router();

// Route to add resources to a service
router.put('/:serviceId/resources', addResourceToService);

module.exports = router;
