const express = require('express');
const router = express.Router();
const addResource = require('../controllers/addResource')
const isAdmin = require('../middleware/isAdmin')

// Route to add a new resource
router.post('/add-resource',isAdmin, addResource);

module.exports = router;
