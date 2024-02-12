const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middleware/authMiddleware');
const homeController = require('../controllers/homeController');

router.get('/home', isAuthenticated, (req, res, next) => {
  // Call the homeController function here
  homeController(req, res, next);
});

module.exports = router;