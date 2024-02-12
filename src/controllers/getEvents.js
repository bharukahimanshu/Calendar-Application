const User = require('../models/user');
const Event = require('../models/events');

async function getEvents(req, res) {
  try {
    const userId = req.user._id;

    // Find the user by ID and populate the eventsAttending field
    const user = await User.findById(userId).populate('eventsAttending', 'title host description startDate endDate attendees');
    
    // Extract the populated events from the user object
    const eventsAttending = user.eventsAttending;

    // Send the events data as JSON response
    res.json(eventsAttending);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = getEvents;

