// config/passport-config.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('../models/user');
const { checkPassword } = require('../controllers/authController');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await users.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      const passwordMatch = await checkPassword(password, user.password);

      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
