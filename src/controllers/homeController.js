async function home(req, res){
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
        // If not authenticated, send error response
        return res.status(401).json({ error: 'Not logged in' });
    }
  
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
  }

  module.exports = home;