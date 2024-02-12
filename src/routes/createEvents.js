const express = require('express');
const router = express.Router();
const createEvent = require('../controllers/createEvents');
const getEvents = require('../controllers/getEvents');
const isAuthenticated = require('../middleware/authMiddleware');




router.get('/create-event',isAuthenticated, (req, res) => {
    res.render('createEvent');    
});

router.post('/create-event',isAuthenticated, createEvent);

router.get('/get-events', isAuthenticated, getEvents);

module.exports=router;
