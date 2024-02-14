const User = require('../models/user');
const Event = require('../models/events');

async function getEvents(req, res) {
  try {
    const userId = req.user._id;
      
    const user = await User.findById(userId);

    const eventIds = user.eventsAttending;
    
    const events = await Event.find({ _id: { $in: eventIds } });
      
      
    const eventsAttending = await Promise.all(events.map(async event => {
      const host = await User.findById(event.host);
        
      return {
        _id: event._id,
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        hostName: host.name, 
        hostEmail: host.email
        };
    }));

    const maybeIds = user.maybeAttending;

    const maybe = await Event.find({ _id: { $in: maybeIds } });
      
  
    const maybeAttending = await Promise.all(maybe.map(async event => {
      const host = await User.findById(event.host);
      return {
        _id: event._id,
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        hostName: host.name, 
        hostEmail: host.email 
      };
    }));
    

    res.json({eventsAttending, maybeAttending});

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = getEvents;