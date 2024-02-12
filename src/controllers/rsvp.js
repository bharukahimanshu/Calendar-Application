const Event = require('../models/events');
const users= require('../models/user');


async function rsvp(req, res){
    const { eventId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        //checking if the user is invited to the event or not
        const invited = await users.findOne({ 
            _id: userId, 
            eventInvitations: eventId // Check if eventId exists in the eventInvitations array
        });

        if (!invited) {
    return res.status(404).json({ error: 'You are not invited to this event' });
}


        if(!invited){
            return res.status(404).json({error:'You are not invited to this event'});
        }
        
        // Update user's RSVP status for the event
        if (status === 'accept') {
            event.attendees.push(userId);
            await event.save();
            // Add event to user's eventsAttending
            await users.findByIdAndUpdate(userId, { $addToSet: { eventsAttending: eventId } });
            await users.updateOne(
                { _id: userId },
                { $pull: { "eventInvitations": eventId } }
            );
              
            res.status(200).json({ message: 'Event accepted' });
        } 
        else if (status === 'decline'){
            event.declined.push(userId);
            
            await users.updateOne(
                { _id: userId },
                { $pull: { "eventInvitations": eventId } }
            );
            await event.save();
            res.status(200).json({ message: 'Event declined' });
        } 
        else if (status === 'maybe') {
            // Add user to event's maybe list
            event.maybe.push(userId);
            await event.save();
            await users.findByIdAndUpdate(userId, { $addToSet: { maybeAttending: eventId } });
            await users.updateOne(
                { _id: userId },
                { $pull: { "eventInvitations": eventId } }
            );
              
            res.status(200).json({ message: 'Maybe attending event' });
        } 
        else {
            return res.status(400).json({ error: 'Invalid RSVP status' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports =  rsvp;