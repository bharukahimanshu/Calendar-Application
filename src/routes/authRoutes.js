const express = require('express');
const router = express.Router();
const { validateSignupForm } = require('../middleware/validationMiddleware');
const { signup, login, logouti} = require('../controllers/authController');
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
    // // If authenticated, proceed to controller function
    // home(req, res);
    if (req.isAuthenticated()) {
        const userEmail = req.user.email;
        const userId = req.user._id;

        res.json({
            success: true,
            message: 'You are logged in',
            email: userEmail,
            id: userId,
        });
    }
});

router.post('/logout', isAuthenticated, (req, res) => {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
        // If not authenticated, send error response
        return res.status(401).json({ error: 'Not logged in' });
    }
    // // If authenticated, proceed to controller function
    // home(req, res);
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }
            res.json({message: 'Logged out'}); 
        });
    }
});

// router.post('/logout', isAuthenticated, logouti);

// router.get('/logout',isAuthenticated, function(req, res) {
//     try{
//         req.logout(); 
//         console.log("logged out")   
//         return res.send({message: 'You are logged out successfully'});
//     }catch(err){
//         console.log(err)
//         return res.status(500).send('Internal Server Error');
//     }
//   });

router.get('/signup', (req, res) => {
    res.render('signup'); 
});

router.post('/signup', validateSignupForm, signup);

router.post('/login', login);

module.exports = router;
