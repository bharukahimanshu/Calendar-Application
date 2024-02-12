const express = require('express');
const router = express.Router();
const createEvent = require('../controllers/createEvents');
const getEvents = require('../controllers/getEvents');
const isAuthenticated = require('../middleware/authMiddleware');


router.get('/get-events',isAuthenticated,  (req, res) => {
    res.render('events');    
});

router.get('/create-event',isAuthenticated, (req, res) => {
    res.render('createEvent');    
});

router.post('/create-event',isAuthenticated, createEvent);

router.post('/get-events', isAuthenticated, getEvents);

module.exports=router;
