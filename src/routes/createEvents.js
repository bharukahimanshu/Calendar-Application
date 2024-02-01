const express = require('express');
const router = express.Router();
const createEvent = require('../controllers/createEvents');
const getEvents = require('../controllers/getEvents');
const isAuthenticated = require('../middleware/authMiddleware');


router.get('/get-events', (req, res) => {
    res.render('events');    
});

router.get('/create-event', (req, res) => {
    res.render('createEvent');    
});

router.post('/create-event',isAuthenticated, createEvent);
router.post('/get-events', getEvents);

module.exports=router;
  