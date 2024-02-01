function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    res.status(401).send('Unauthorized. Please log in.');
  }
  
  module.exports = isAuthenticated;
  