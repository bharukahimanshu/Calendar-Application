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
            const validEmails = [];
            const invalidEmails = [];
        
            // Check each email individually
            for (const email of attendeesToAdd) {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    // Email exists, add it to the valid emails list
                    validEmails.push(email);
                } else {
                    // Email doesn't exist, add it to the invalid emails list
                    invalidEmails.push(email);
                }
            }

            if (invalidEmails.length > 0) {
                console.log("Invalid email");
                return res.status(400).json({ error: `Email(s) not found: ${invalidEmails.join(', ')}` });
            }        
            
            // Add valid email addresses to the event's emails array
            event.emails.push(...validEmails);
        
            // Update users with valid email addresses
            await User.updateMany(
                { email: { $in: validEmails } },
                { $addToSet: { eventInvitations: eventId } }
            );
        }
        
        async function removeEventFromUserAndUserFromEvent(userId, UserEmail,eventId) {
            try {
                // Remove the event ID from the user's arrays
                await User.updateOne({ _id: userId }, {
                    $pull: {
                        eventsAttending: eventId,
                        maybeAttending: eventId,
                        eventInvitations: eventId
                    }
                });
        
                // Remove the user ID from the event's arrays
                await Event.updateOne({ _id: eventId }, {
                    $pull: {
                        emails: UserEmail,
                        attendees: userId,
                        declined: userId,
                        maybe: userId
                    }
                });
        
                console.log(`Event ${eventId} removed from user ${userId} and user ${userId} removed from event ${eventId}`);
            } catch (error) {
                console.error('Error removing event from user and user from event:', error);
                throw error; 
            }
        }

        if (attendeesToRemove && attendeesToRemove.length > 0) {
            // Remove event from users and users from event
            
            const validEmails = [];
            const invalidEmails = [];
        
            // Check each email individually
            for (const email of attendeesToRemove) {
                const existingUser = await User.findOne({ email });
                const userInvited = await Event.findOne({ _id: eventId, emails: email });
                if (existingUser && userInvited) {
                    // Email exists, add it to the valid emails list
                    validEmails.push(email);
                } else {
                    // Email doesn't exist, add it to the invalid emails list
                    invalidEmails.push(email);
                }
            }

            if (invalidEmails.length > 0) {
                console.log("Invalid email");
                return res.status(400).json({ error: `Email(s) not found: ${invalidEmails.join(', ')}` });
            }

            const removeEventPromises = validEmails.map(async (email) => {
                const user = await User.findOne({ email });               
                if (user) {
                    return removeEventFromUserAndUserFromEvent(user._id, email, eventId);
                }     
            });
            await Promise.all(removeEventPromises);
        }

        // Save the updated event
        await event.save();
      
        res.status(200).json({ message: 'Event details updated successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = editEvents;