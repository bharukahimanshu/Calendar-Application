const express = require('express');
const router = express.Router();
const getAllResources = require('../controllers/getAllResources')
// Route to get all resources with populated service and booking information
router.get('/getAllResources', getAllResources);

module.exports = router;
