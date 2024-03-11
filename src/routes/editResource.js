const express = require('express');
const router = express.Router();
const editResource = require('../controllers/editResource');

// PUT route to edit a resource
router.put('/edit-resource/:id',editResource);

module.exports = router;
