const User = require('../models/user');

async function isAdmin(req, res, next) {
    // Check if the user is logged in and has the role of 'admin'
    
    const user = await User.findById(req.user._id);
    console.log(user.role);

    if (user && user.role === 'Admin') {
      // If the user is an admin, proceed to the next middleware or route handler
      next();
    } else {
      // If the user is not an admin, return an unauthorized error
      res.status(403).json({ error: 'Unauthorized access' });
    }
  }

module.exports = isAdmin;