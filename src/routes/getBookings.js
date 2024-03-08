const express = require('express');
const router = express.Router();

const getBookings = require('../controllers/getBookings');
const isAuthenticated = require('../middleware/authMiddleware');


router.get('/get-bookings', isAuthenticated, getBookings);

module.exports=router;
