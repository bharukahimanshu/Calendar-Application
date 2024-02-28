const express = require('express');
const router = express.Router();

const getTasks = require('../controllers/getTasks');
const isAuthenticated = require('../middleware/authMiddleware');


router.get('/get-tasks', isAuthenticated, getTasks);

module.exports=router;
