const express = require('express');
const router = express.Router();
const { validateSignupForm } = require('../middleware/validationMiddleware');
const { signup, login, logout } = require('../controllers/authController');
const isAuthenticated = require('../middleware/authMiddleware');


router.get('/', (req, res) => {
    res.render('login');    
});


router.get('/login', (req, res) => {
    const errorMessage = 'The credentials you entered are incorrect!'; 
    res.render('login', { errorMessage });
  });
  

router.post('/logout', isAuthenticated, logout);


router.get('/signup', (req, res) => {
    res.render('signup'); 
});

router.post('/signup', validateSignupForm, signup);

router.post('/login', login);

module.exports = router;
