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

router.get('/home', isAuthenticated, (req, res) => {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
        // If not authenticated, send error response
        return res.status(401).json({ error: 'Not logged in' });
    }
    // If authenticated, proceed to controller function
    home(req, res);
});


router.post('/logout', isAuthenticated, logout);


router.get('/signup', (req, res) => {
    res.render('signup'); 
});

router.post('/signup', validateSignupForm, signup);

router.post('/login', login);

module.exports = router;
