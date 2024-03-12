const express = require('express');
const router = express.Router();
const deleteResource = require('../controllers/deleteResource');

// DELETE route to delete a resource
router.delete('/delete-resource/:resourceId', deleteResource);

module.exports = router;
