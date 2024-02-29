const bcrypt = require('bcrypt');
const users = require('../models/user');
const passport = require('passport');
const isAuthenticated = require('../middleware/authMiddleware');

async function signup(req, res) {
    try {
        const existingUser = await users.findOne({ email: req.body.email });

        if (existingUser) {
          return res.json({ message: 'User Exists' });

        }

        const hashedPassword = await hashPassword(req.body.password);
        const data = {
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
            phone_no: req.body.phone_no,
            role: req.body.role
        };

        await users.insertMany([data]);
        res.json({ message: 'Account created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


const passportLoginMiddleware = passport.authenticate('local', {
    // successRedirect: 'http://localhost:5173/home', // Redirect on successful login
    // failureRedirect: 'http://localhost:5173/', // Redirect on failed login
    failureFlash: true, // Enable flash messages for failed login
  });
  
  function login(req, res, next) {
    passportLoginMiddleware(req, res, async (err) => {
      try {
          if (err) {
              throw err;
          }

          // If no error, retrieve user information
          const user = req.user;

          const data = {
            email: req.user.email,
            name: req.user.name,
            phone_no: req.user.phone_no,
            role: req.user.role
          };

          if (!user) {
              return res.status(401).json({ error: 'Authentication failed' });
          }

          // Return user information as JSON
          res.status(200).json(data );
      } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
      }
  });
  }

function logout(req, res){
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
      // If not authenticated, send error response
      return res.status(401).json({ error: 'Not logged in' });
  }

  if (req.isAuthenticated()) {
      req.logout((err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
          res.json({message: 'Logged out'}); 
      });
  }
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



