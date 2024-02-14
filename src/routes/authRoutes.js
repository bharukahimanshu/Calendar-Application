const express = require('express');
const router = express.Router();
const { validateSignupForm } = require('../middleware/validationMiddleware');
const { signup, login, logout, home} = require('../controllers/authController');
const isAuthenticated = require('../middleware/authMiddleware');



router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', isAuthenticated, logout);
module.exports = router;
