const events = require('../models/events');
const users = require('../models/user');
const nodemailer = require('nodemailer');
const env = require('dotenv');
env.config();

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
    createdEvent.attendees.push(host._id);
    await(createdEvent.save());

    // Update the events array for each invitee with the reference to the new event
    const updatePromises = invitees.map(async (invitee) => {
      invitee.eventInvitations.push(createdEvent._id);
      await invitee.save();
    
      const startDate = new Date(newEvent.startDate);
      const startTime = startDate.toLocaleTimeString();
      const startDateFormatted = startDate.toLocaleDateString();
      
      const endDate = new Date(newEvent.endDate);
      const endTime = endDate.toLocaleTimeString();
      const endDateFormatted = endDate.toLocaleDateString();
      
      const eventDetails = `
      <b>Title:</b> ${newEvent.title}<br>
      <b>Start Date:</b> ${startDateFormatted}<br>
      <b>Start Time:</b> ${startTime}<br>
      <b>End Date:</b> ${endDateFormatted}<br>
      <b>End Time:</b> ${endTime}<br>
      <b>Description:</b> ${newEvent.description}<br>
      <b>Host:</b> ${host.name}<br>
      <b>Host Email:</b> ${host.email}<br>
      Please <a href="http://localhost:3000/login">Login</a> to your account to view and respond to this event
      `;


      sendEmail(req.user.email, req.user.name, invitee.email, 'You have been invited to a new event!', eventDetails);
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

async function sendEmail(from_email, from_name, to, subject, htmlContent) {
  // Create a nodemailer transporter
  let transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
  },
  });

  // Define email options
  let mailOptions = {
    from: `"${from_name}" <${from_email}>`,
    to: to,
    subject: subject,
    html :htmlContent,
  };

  // Send email
  await transporter.sendMail(mailOptions);
}

module.exports = createEvent;
