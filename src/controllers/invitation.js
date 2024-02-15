const User = require('../models/user');
const Event = require('../models/events');

async function invitations(req, res) {
    try {
      const userId = req.user._id;

        // Find the user by ID
      const user = await User.findById(userId);

        // Extract event IDs from the user's eventInvitations array
      const eventIds = user.eventInvitations;
        

        // Query events by IDs and populate the 'host' field
      const events = await Event.find({ _id: { $in: eventIds } });
        
        

        // Modify the response to include host email instead of host ID
      const modifiedEvents = await Promise.all(events.map(async event => {
          const host = await User.findById(event.host);
          return {
            _id: event._id,
            title: event.title,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            host: host._id, 
            hostEmail: host.email
          };
      }));
      
        // Send the modified events data as JSON response
      res.json(modifiedEvents);
  
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = invitations;
