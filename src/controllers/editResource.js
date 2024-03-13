const Resource = require('../models/resources');
const moment = require('moment')

// PUT route to edit a resource
async function editResource(req, res){
  try {
    const { id } = req.params;
    const { name, email, phone_no, description, workingHours, duration } = req.body;

    // Check if the resource exists
    const existingResource = await Resource.findById(id);
    if (!existingResource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Update resource fields
    if(name)existingResource.name = name;
    if(email)existingResource.email = email;
    if(phone_no)existingResource.phone_no = phone_no;
    if(description)existingResource.description = description;
    
    const utcWorkingHours = {};
    if(workingHours){
        Object.keys(workingHours).forEach(day => {
            utcWorkingHours[day] = workingHours[day].map(timeRange => {
                const [startTime, endTime] = timeRange.split('-').map(time => {
                    const [hours, minutes] = time.trim().split(':');
                    const localTime = moment().set({ hour: parseInt(hours), minute: parseInt(minutes) });
                    return localTime.utc().format('HH:mm');
                });
                return `${startTime} - ${endTime}`;
            });
        });
 
    }
    console.log(utcWorkingHours);
    existingResource.workingHours = utcWorkingHours;
    if(duration)existingResource.duration = duration;

    // Save the updated resource
    const updatedResource = await existingResource.save();

    res.json(updatedResource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = editResource;
