const events = require('../models/events')
const users = require('../models/user')

async function createEvent(req, res){
  try {
    const hostEmail = req.user.email;
    const host = await users.findOne({ email: hostEmail }); 
    const invitee = await users.findOne({ email: req.body.email });
    
    if (!invitee) {
        return res.send('Account does not exist');
    }

    const newEvent = {
      title:req.body.title,
      email:req.body.email,
      date:req.body.date,
      time:req.body.time,
      description:req.body.description,
      host: host._id, // Reference to the host user
      
    };

    const createdEvent = await events.create(newEvent);

    // Update the user's events array with the reference to the new event
    invitee.events.push(createdEvent._id);
    await invitee.save();

    res.send('Event added successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}



module.exports = createEvent;