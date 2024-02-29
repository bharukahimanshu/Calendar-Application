async function home(req, res){
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
        // If not authenticated, send error response
        return res.status(401).json({ error: 'Not logged in' });
    }
  
    if (req.isAuthenticated()) {
        const userEmail = req.user.email;
        const userId = req.user._id;
        const userNo = req.user.phone_no;
        const userRole = req.user.role;
 
        res.json({
            success: true,
            message: 'You are logged in',
            email: userEmail,
            id: userId,
            role: userRole,
            phone_no: userNo
        });
    }
  }

  module.exports = home;