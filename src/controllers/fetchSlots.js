const moment = require('moment');
const Resources = require('../models/resources');
const Services = require('../models/services');
const mongoose = require('mongoose');
const Bookings = require( '../models/bookings');


// Function to generate available time slots for a specific date and resource
async function generateAvailableTimeSlots(resourceId, serviceId, date) {
  try {

    const resource = await Resources.findById(resourceId);
    const duration = resource.duration; 
    if (!resource) {
      throw new Error('Resource not found');
    }

    const service = await Services.findById(serviceId);
    // in minutes
    console.log(duration);

    const dayOfWeek = moment(date).format('dddd').toLowerCase(); // Get the day of the week for the selected date
    console.log(dayOfWeek);
    const workingHours = resource.workingHours[dayOfWeek]; // Get the working hours for the corresponding day
    console.log("UTC",workingHours);
    
    // Convert working hours to local time
const localWorkingHours = workingHours.map(timeRange => {
  const [startTime, endTime] = timeRange.split('-').map(time => {
    const [hours, minutes] = time.trim().split(':');
    return moment.utc().set({ hour: parseInt(hours), minute: parseInt(minutes) }).local().format('HH:mm');
  });

  return `${startTime} - ${endTime}`;
});


    console.log("local:",localWorkingHours);

    if (!workingHours || workingHours.length === 0) {
      return []; // Return an empty array if no working hours are defined for the selected day
    }

      const startLocalDate = new Date(date); // Assuming user inputs local dates
      const endLocalDate = new Date(startLocalDate);
      endLocalDate.setHours(startLocalDate.getHours() + 24); // Assuming user inputs local dates
      
      // Convert local dates to UTC dates by adding/subtracting the time zone offset
      const startUTCDate = new Date(startLocalDate.getTime() + (startLocalDate.getTimezoneOffset() * 60000));
      const endUTCDate = new Date(endLocalDate.getTime() + (endLocalDate.getTimezoneOffset() * 60000));

    console.log(startUTCDate, endUTCDate);
    const existingBookings = await Bookings.find({
      resource: resourceId,
      startDate:{$gte: startUTCDate},
      endDate: { $lt: endUTCDate }
    });

    // console.log(existingBookings);
       

    // Iterate through each time range for the day
    const availableTimeSlots = [];
    workingHours.forEach(timeRange => {
      
      const [startStr, endStr] = timeRange.split('-').map(time => time.trim());
      console.log("-----------------------","startStr, endStr",startStr, endStr, "-----------------------");
      // const startUtc = moment.utc(startStr, 'HH:mm'); // Convert start time to UTC

      let currentDate = moment.utc(date);
      const startUtc = moment.utc(`${currentDate.format('YYYY-MM-DD')} ${startStr}`, 'YYYY-MM-DD HH:mm');

      
      // const endUtc = moment.utc(endStr, 'HH:mm'); // Convert end time to UTC
      const endUtc = moment.utc(`${currentDate.format('YYYY-MM-DD')} ${endStr}`, 'YYYY-MM-DD HH:mm');

      console.log("startUtc",startUtc,"endUtc", endUtc);
      // console.log(moment.utc(date).startOf('day'));
      console.log("startUTCDate", startUTCDate);
    
      // Generate time slots within the working hours for the day
      let currentTime = moment.max(startUTCDate, startUtc); // Start from the maximum of the start time and the beginning of the day in UTC
      while (currentTime.isBefore(endUtc)) {
        console.log("Entered the loop");
        const endTime = moment(currentTime).add(duration, 'minutes'); // Add duration in minutes
        console.log("Current Time is ", currentTime, "End Time:", endTime);
        // Convert time slots to local time for display
        const startTimeLocal = currentTime.local().format('HH:mm'); // Convert current time to local time
        const endTimeLocal = endTime.local().format('HH:mm'); // Convert end time to local time
    
        // Check if the time slot overlaps with existing bookings
        const overlapsWithBookings = existingBookings.some(booking => {
          const bookingStartDate = moment.utc(booking.startDate); // Convert booking start date to UTC
          const bookingEndDate = moment.utc(booking.endDate); // Convert booking end date to UTC
          return bookingStartDate.isBefore(endTime) && bookingEndDate.isAfter(currentTime);
        });
    
        // If the time slot is available, add it to the list in UTC
        if (!overlapsWithBookings) {
          availableTimeSlots.push({
            // startTime: currentTime.utc().format('HH:mm'), // Store start time in UTC
            // endTime: endTime.utc().format('HH:mm') // Store end time in UTC

            startTime: startTimeLocal, // Store start time in UTC
            endTime: endTimeLocal// Store end time in UTC
          });
        }
        else{
          console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx","Skipped:",currentTime.utc().format('HH:mm'), startTimeLocal, endTime.utc().format('HH:mm'),endTimeLocal,"xxxxxxxxxxxxxxxxxxxxxxxxxxx");
        }
    
        // Move to the next time slot
        currentTime = endTime;
      }
    });

    return availableTimeSlots;
  } catch (error) {
    throw new Error(error.message);
  }
}


// Route to generate available time slots
async function availableTimeSlots(req, res){
  try {
    
    const serviceId = req.params.serviceId;
    const resourceId = req.params.resourceId; // Get resource ID from query parameter
    const date = req.params.date; // Get date from query parameter
    
    if (!resourceId || !date || !serviceId) {
      return res.status(400).json({ error: 'Resource ID, date, and Service id are required' });
    }

    const availableTimeSlots = await generateAvailableTimeSlots(resourceId,  serviceId, date);
    res.json(availableTimeSlots);
  } catch (error) {
    console.error('Error generating available time slots:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = availableTimeSlots;