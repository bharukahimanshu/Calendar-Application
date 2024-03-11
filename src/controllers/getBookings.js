const User = require('../models/user');
const Bookings = require('../models/bookings');
const Services = require('../models/services');
const Resources = require('../models/resources');

async function getBookings(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let defaultQuery;

    // Check if user is admin
    if (user.role === 'Admin') {
      // Admin can view all bookings
      defaultQuery = {};
    } else if (user.role === 'Agent') {
      // Agent can only view their own bookings
      defaultQuery = { creator: userId };
    } else {
      // Unauthorized user role
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get the local time of the user
    const userUTCTime = new Date();
    // Get the current UTC time and convert it to IST
    // const userISTTime = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    // console.log("userISTTime",userISTTime);
    const offsetMinutes = userUTCTime.getTimezoneOffset();
    // Calculate the local time by adding the offset to the UTC time
    const userLocalTime = new Date(userUTCTime.getTime() - (offsetMinutes * 60000));
    
    // Convert the local time to ISO string format
    const userLocalISOString = userLocalTime.toISOString();
    
    console.log("UserLocalTIme",userLocalISOString);
    
    // userISTTime.setUTCHours(0, 0, 0, 0);
    // console.log("userISTTime", userISTTime);
    userLocalTime.setUTCHours(0, 0, 0, 0);
    console.log("userLocalTime",userLocalTime);

    // const endDate = new Date(userISTTime.getTime() + 86400000);
    // console.log("endDate",endDate);

    const endDate = new Date(userLocalTime.getTime() + 86400000);
    console.log("endLocalDate",endDate);

    const startUTCTime = new Date(userLocalTime.getTime() + userLocalTime.getTimezoneOffset() * 60000);
    // Convert endDate to UTC
    const endUTCTime = new Date(endDate.getTime() + endDate.getTimezoneOffset() * 60000);


    console.log("startUTCTime",startUTCTime);
    console.log("endUTCTime",endUTCTime);
    
    defaultQuery.startDate = {
      $gte: startUTCTime.toISOString(),
      $lt: endUTCTime.toISOString()  
    };

    // Check if a date range is provided in the request body
    if (req.query.startDate && req.query.endDate) {
      // Convert the start and end dates to UTC timezone (ignoring time)
      console.log("Range search")
      const startLocalDate = new Date(req.query.startDate); // Assuming user inputs local dates
      const endLocalDate = new Date(req.query.endDate); // Assuming user inputs local dates
      // console.log(startLocalDate);
      // console.log(endLocalDate);
  
      // Convert local dates to UTC dates by adding/subtracting the time zone offset

      const startUTCDate = new Date(startLocalDate.getTime() + (startLocalDate.getTimezoneOffset() * 60000));
      const endUTCDate = new Date(endLocalDate.getTime() + (endLocalDate.getTimezoneOffset() * 60000));
  
      // Update the query to find bookings within the specified date range
      
      defaultQuery.startDate = {
          $gte: startUTCDate.toISOString(),
          $lt: new Date(endUTCDate.getTime() + 24 * 60 * 60 * 1000).toISOString() // Increment endDate by one day to include bookings on endDate
      };
  }

  if (req.query.phone_no) {
    console.log("Phone number filter applied"); 
    defaultQuery.related_to = req.query.phone_no;
  }

  if (req.query.status) {
    console.log("Status filter applied"); 
    defaultQuery.status = req.query.status;
  }

  if (req.query.resource) {
    console.log("Resource filter applied");
    const resource = await Resources.findOne({ name: req.query.resource });
    if (resource) {
        defaultQuery.resource = resource._id;
    } else {
        console.log("Resource not found");
        return res.status(404).json({ error: 'Resource not found' });
    }
}

if (req.query.service) {
    console.log("Service filter applied");
    const service = await Services.findOne({ name: req.query.service });
    if (service) {
        defaultQuery.service = service._id;
    } else {
        console.log("Service not found");
        return res.status(404).json({ error: 'Service not found' });
    }
}

    // Query the database
    const bookings = await Bookings.find(defaultQuery);

    // Convert retrieved datetime values from UTC to the local time of the user
    const bookingsInLocalTime = await Promise.all(bookings.map(async booking => {
      const creatorId = booking.creator;
      const creator = await User.findById(creatorId); // Wait for the promise to resolve
      const serviceId= booking.service;
      const service= await Services.findById(serviceId);
      const resourceId = booking.resource;
      const resource = await Resources.findById(resourceId);

      
      return {
        _id:booking._id,
        title: booking.title,
        description: booking.description,
        startDate: new Date(booking.startDate.getTime() - userUTCTime.getTimezoneOffset() * 60000),
        endDate:new Date(booking.endDate.getTime() - userUTCTime.getTimezoneOffset() * 60000),
        status: booking.status,
        creatorPhone: creator.phone_no,
        creatorName: creator.name,
        creatorMail: creator.email,
        related_to: booking.related_to,
        customerId:booking.customerId,
        statusChangeHistory: booking.statusChangeHistory.map(change => ({
            previousStatus: change.previousStatus,
            newStatus: change.newStatus,
            timestamp: new Date(change.timestamp.getTime() - userUTCTime.getTimezoneOffset() * 60000)
        })),
        service: service.name,
        resource: resource.name
      };
  }));
  

    res.json(bookingsInLocalTime);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = getBookings;
