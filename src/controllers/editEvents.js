const Event = require('../models/events');
const User = require('../models/user');

async function editEvents(req, res){
    try {
        const { eventId } = req.params;
        const { title, description, startDate, endDate, attendeesToAdd, attendeesToRemove } = req.body;
        const userId = req.user._id;

        // Find the event by ID
        const event = await Event.findById(eventId);
        

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
 
        if (event.host.toString()!== userId.toString()) {
            return res.status(403).json({ error: 'You are not authorized to edit this event' });
        }


        // Update event details
        event.title = title;
        event.description = description;
        event.startDate = startDate;
        event.endDate = endDate;

        // Add new attendees
        if (attendeesToAdd && attendeesToAdd.length > 0) {
            // Spread the elements of attendeesToAdd
            event.emails.push(...attendeesToAdd);

            // Update users' eventsAttending field
            await User.updateMany(
                { email: { $in: attendeesToAdd } },
                { $addToSet: { event: eventId } }
            );
        }

        // Remove existing attendees
        if (attendeesToRemove && attendeesToRemove.length > 0) {
            // Find user IDs corresponding to the provided email addresses
            const existingAttendees = await User.find({ email: { $in: attendeesToRemove } }).select('_id');

            // Remove attendees from the event
            event.attendees = event.attendees.filter(attendee => !existingAttendees.some(user => user._id.equals(attendee)));

            // Update users' eventsAttending field
            await User.updateMany(
                { email: { $in: attendeesToRemove } },
                { $pull: { eventsAttending: eventId } }
            );
        }

        // Save the updated event
        await event.save();

        res.status(200).json({ message: 'Event details updated successfully', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = editEvents;