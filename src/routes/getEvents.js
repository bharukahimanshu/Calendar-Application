const express = require('express');
const router = express.Router();

const getEvents = require('../controllers/getEvents');
const isAuthenticated = require('../middleware/authMiddleware');


router.get('/get-events', isAuthenticated, getEvents);

module.exports=router;
