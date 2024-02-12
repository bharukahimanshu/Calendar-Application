const express = require('express');
const router = express.Router();
const { validateSignupForm } = require('../middleware/validationMiddleware');
const { signup, login, logout, home} = require('../controllers/authController');
const isAuthenticated = require('../middleware/authMiddleware');


router.get('/', (req, res) => {
    res.json('This is login page')   
});

router.get('/login', (req, res) => {
    res.json('This is login page');
});

router.get('/signup', (req, res) => {
    res.render('signup'); 
});

router.post('/signup', validateSignupForm, signup);

router.post('/login', login);

router.post('/logout', isAuthenticated, logout);
module.exports = router;
