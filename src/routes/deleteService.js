const express = require('express');
const router = express.Router();
const deleteService = require('../controllers/deleteService');

router.delete('/delete-service/:serviceId', deleteService);

module.exports = router;
