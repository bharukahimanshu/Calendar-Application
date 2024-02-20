const events = require('../models/events');
const users = require('../models/user');
const nodemailer = require('nodemailer');
const env = require('dotenv');
env.config();

// Function to send reminder emails to event attendees
async function sendReminderEmails() {
    try {
        
        const fifteenMinutesFromNow = new Date(Date.now() + 15 * 60000);
        console.log(fifteenMinutesFromNow);
        
        // Round the current time down to the nearest minute
        const MinuteStart = new Date(Math.floor(fifteenMinutesFromNow.getTime() / 60000) * 60000);
        console.log(MinuteStart);
        
        // Calculate the end of the next minute
        const endOfNextMinute = new Date(MinuteStart.getTime() + 60000);
        console.log(endOfNextMinute);
        
        // Find events starting on or after the current time up to the end of the next minute
        const upcomingEvents = await events.find({ startDate: { $gte: MinuteStart, $lt: endOfNextMinute } });
       
        upcomingEvents.forEach(event => {
            console.log(event._id);
        });

        // Iterate through each upcoming event
        for (const event of upcomingEvents) {
            // Fetch details of attendees for the event
            //console.log(event._id);
            
            const attendees = await users.find({ eventsAttending: event._id });

            // Iterate through each attendee and send reminder email
            for (const attendee of attendees) {
                const transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASSWORD
                    }
                });

                const mailOptions = {
                    from: 'Your Name <your-email@gmail.com>',
                    to: attendee.email,
                    subject: `Reminder: ${event.title}`,
                    text: `Event "${event.title}" starts in 15 minutes!`,
                };

                await transporter.sendMail(mailOptions);
                console.log(`Reminder email sent to ${attendee.email}`);
            }
        }
    } catch (error) {
        console.error('Error sending reminder emails:', error);
    }
}

// Schedule the task to run every minute (for demonstration)
setInterval(sendReminderEmails, 60000); // Adjust the interval as needed

module.exports = {
    sendReminderEmails: sendReminderEmails
};
