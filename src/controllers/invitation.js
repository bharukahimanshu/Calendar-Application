const User = require('../models/user');
const Event = require('../models/events');

async function invitations(req, res){
    try {
        const userId = req.user._id;
    
        // Find the user by ID and populate the eventsAttending field
        const user = await User.findById(userId).populate('eventInvitations', 'title _id host description startDate endDate attendees');
        
        // Extract the populated events from the user object
        const eventInvitations = user.eventInvitations;
    
        // Send the events data as JSON response
        res.json(eventInvitations);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

module.exports = invitations;