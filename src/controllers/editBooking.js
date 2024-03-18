const Bookings = require('../models/bookings');
const logStatusChange = require('../controllers/statusLogger');
const Services = require('../models/services');
const Resources = require('../models/resources')

async function editBooking(req, res) {
  try {
    const bookingId = req.params.bookingId;
    const { title, description, startDate, endDate, status, related_to, serviceName, resourceName} = req.body;
    
    const userId = req.user._id;
    console.log(bookingId);

    // Find the booking by ID
    const booking = await Bookings.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (title) booking.title = title;
    if (description) booking.description = description;
    if (startDate && endDate){
      booking.startDate = startDate;
      booking.endDate = endDate;
    };
    if (related_to) booking.related_to = related_to;
    if (status) {
      const previousStatus = booking.status;
      booking.status = status;
      // Log status change
      await logStatusChange(bookingId, previousStatus, status);
    }

    const oldResourceId =booking.resource;
    const oldServiceId = booking.service;
    console.log("old resource", oldResourceId, "old service", oldServiceId);

    const resource = await Resources.findOne({name: resourceName})
    
    if(resource){
      console.log("New resource", resource._id);
      booking.resource = resource._id;
    }
    else{
      return res.status(404).json({ error: 'Resource not found' });
    }

    const service = await Services.findOne({name: serviceName});
    console.log("New service", service._id);
    if(service){
      booking.service = service._id;
    }
    else{
      return res.status(404).json({ error: 'Service not found' });
    }

    //removing from the existing service
    const oldService = await Services.findById(oldServiceId);
    const serviceIndex = oldService.bookings.indexOf(bookingId);
    if (serviceIndex !== -1) {
      oldService.bookings.splice(serviceIndex, 1);
      // Save the updated service
      await oldService.save();
      console.log("Removed from old service");
    }

    //removing from the existing resource

    const oldResource = await Resources.findById(oldResourceId);
    console.log("oldResource bookings", oldResource.bookings, oldResource.name);
    if(oldResource){
      const resourceIndex = oldResource.bookings.indexOf(bookingId);
      console.log(resourceIndex);
    if (resourceIndex !== -1) {
      oldResource.bookings.splice(resourceIndex, 1);
      // Save the updated service
      await oldResource.save();
      console.log("Removed from old Resource");
    }
    }
    else{
      console.log("resource bookings is null")
    }

    
    // Save the updated booking
    await booking.save();

    //adding the booking to new resource
   
    resource.bookings.push(booking._id);
    await resource.save();
    
    //adding the booking to new service
    service.bookings.push(booking._id);
    await service.save();
    

    res.json({ message: 'booking updated successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = editBooking;
