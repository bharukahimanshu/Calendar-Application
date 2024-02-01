const bcrypt = require('bcrypt');
const users = require('../models/user');
const passport = require('passport');

async function signup(req, res) {
    try {
        const existingUser = await users.findOne({ email: req.body.email });

        if (existingUser) {
            return res.send('Account with the provided email already exists');
        }

        const hashedPassword = await hashPassword(req.body.password);
        const data = {
            email: req.body.email,
            password: hashedPassword,
        };

        await users.insertMany([data]);
        res.send('Account created successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


const passportLoginMiddleware = passport.authenticate('local', {
    successRedirect: '/create-event', // Redirect on successful login
    failureRedirect: '/login', // Redirect on failed login
    failureFlash: true, // Enable flash messages for failed login
  });
  
  function login(req, res, next) {
    passportLoginMiddleware(req, res, (err) => {
      // Custom handling of flash messages
      const errorMessages = req.flash('error');
  
      if (errorMessages.length > 0) {
        // Flash message is present, render login page with error message
        return res.render('login', { errorMessage: errorMessages[0] });
      }
  
      // No flash message, continue with the default behavior
      next(err);
    });
  }

  function logout(req, res) {
    req.logout(err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      res.redirect('/signup'); 
    });
  }
    

async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function checkPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = { signup, login, checkPassword, logout };



// async function login(req, res) {
//     try {
//         const user = await users.findOne({ email: req.body.email });

//         if (user && (await checkPassword(req.body.password, user.password))) {
//             res.send('Login Successful');
//         } else {
//             res.send('Incorrect email or password');
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// }