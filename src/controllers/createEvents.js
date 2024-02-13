const events = require('../models/events');
const users = require('../models/user');

async function createEvent(req, res) {
  try {
    const hostEmail = req.user.email;
    const host = await users.findOne({ email: hostEmail });

    if (!host) {
      return res.status(404).send('Host user not found');
    }

    const emailList = req.body.emails;

    if (!emailList || !Array.isArray(emailList)) {
      return res.status(400).send('Invalid email list');
    }

    const inviteePromises = emailList.map(async (email) => {
      const invitee = await users.findOne({ email });
      if (!invitee) {
        return res.status(404).send(`User with email ${email} not found`);
      }
      return invitee;
    });

    const invitees = await Promise.all(inviteePromises);

    const newEvent = {
      title: req.body.title,
      emails: emailList,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      description: req.body.description,
      host: host._id,
    };

    const createdEvent = await events.create(newEvent);

    // Update the events array for each invitee with the reference to the new event
    const updatePromises = invitees.map(async (invitee) => {
      invitee.eventInvitations.push(createdEvent._id);
      await invitee.save();
    });

    await Promise.all(updatePromises);

    host.eventsAttending.push(createdEvent._id);
    await host.save();

    res.send('Event added successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = createEvent;
