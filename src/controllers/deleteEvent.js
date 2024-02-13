const Event = require('../models/events');
const User = require('../models/user');


async function deleteEvent(req, res){
    try {
        const { eventId } = req.params;
        const userId = req.user._id;

        // Find the event by ID
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (event.host.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'You are not authorized to delete this event' });
        }

        // Delete the event from all users' arrays
        const usersUpdatePromises = [];

        // Remove event from users' eventsAttending array
        usersUpdatePromises.push(User.updateMany(
            { eventsAttending: eventId },
            { $pull: { eventsAttending: eventId } }
        ));

        // Remove event from users' maybeAttending array
        usersUpdatePromises.push(User.updateMany(
            { maybeAttending: eventId },
            { $pull: { maybeAttending: eventId } }
        ));

        // Remove event from users' eventInvitations array
        usersUpdatePromises.push(User.updateMany(
            { eventInvitations: eventId },
            { $pull: { eventInvitations: eventId } }
        ));

        // Execute all update promises
        await Promise.all(usersUpdatePromises);

        // Finally, delete the event itself
        await Event.findByIdAndDelete(eventId);

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = deleteEvent;