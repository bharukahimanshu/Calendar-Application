const express = require('express');
const router = express.Router();
const addService = require('../controllers/addService');
const isAdmin = require('../middleware/isAdmin')

router.post('/add-service', isAdmin, addService);

module.exports=router;
