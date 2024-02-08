const User = require('../models/user');
const Event = require('../models/events');

// async function getEvents(req, res) {
//   try {
//     const userEmail = req.user.email;

  
//     const userEvents = await User.findOne({ email: userEmail });

//     if (!userEvents) {

//       return res.status(404).json({ message: 'User not found' });
//     }   

   
//     const eventIds = userEvents.events;

    
//     const detailedEvents = await Event.find({ _id: { $in: eventIds } }).populate({
//       path: 'host',
//       model: 'users', 
//       select: 'email',   
//     });

//     const formattedEvents = detailedEvents.map((event) => ({
//       title: event.title,
//       host: event.host.email,
//       description: event.description,
//       date: event.date,
//       time: event.time,
//     }));

//     // Return the formatted events as JSON
//     res.json(formattedEvents);
    
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// }

async function getEvents (req, res){
  const userId = req.user._id;
  const user = await User.findById(userId)
      .populate('eventsAttending eventInvitations');
  res.json(user);
};

module.exports = getEvents;
