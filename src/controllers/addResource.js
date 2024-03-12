const Resources = require('../models/resources');
const moment = require('moment');

async function addResource(req, res){
    try {
      const { name, email, phone_no, description, duration} = req.body;
    
      // Create a new resource instance
      // if(req.body.workingHours){
      //   const utcWorkingHours = {};
      //   Object.keys(workingHours).forEach(day => {
      //       utcWorkingHours[day] = workingHours[day].map(timeRange => {
      //           const [startTime, endTime] = timeRange.split('-').map(time => {
      //               const [hours, minutes] = time.trim().split(':');
      //               const localTime = moment().set({ hour: parseInt(hours), minute: parseInt(minutes) });
      //               return localTime.utc().format('HH:mm');
      //           });
      //           return `${startTime} - ${endTime}`;
      //       });
      //   });
      // }
      

      console.log(utcWorkingHours);
      const newResourceData = {
        name: name,
        description: description,
        duration: duration
      
      };
      // Add email if provided
      if (email) {
        newResourceData.email = email;
      }
  
      // Add phone number if provided
      if (phone_no) {
        newResourceData.phone_no = phone_no;
      }
  
      const newResource= new Resources(newResourceData);
  
      // Save the new resource member to the database
      const savedResource = await newResource.save();
  
      // Return the saved resource member
      res.status(201).json({ resource: savedResource });
    } catch (error) {
      console.error('Error adding resource:', error);
      res.status(500).json({ error: 'Error adding resource' });
    }
  }

  module.exports = addResource;