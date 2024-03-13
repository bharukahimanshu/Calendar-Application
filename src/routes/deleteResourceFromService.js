const express = require('express');
const router = express.Router();
const deleteResourceFromService = require('../controllers/deleteResourceFromService')

// PUT route to edit a resource
router.put('/delete-resource/:serviceId/:resourceId', deleteResourceFromService);

module.exports = router;
