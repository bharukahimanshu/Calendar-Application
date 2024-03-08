const express = require('express');
const router = express.Router();
const createBooking = require('../controllers/createBooking');

router.post('/create-booking', createBooking);
module.exports=router;
