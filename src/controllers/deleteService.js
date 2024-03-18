const Service = require('../models/services');
const Resource = require('../models/resources');
const Booking = require('../models/bookings');
const logStatusChange = require('../controllers/statusLogger');


async function deleteService(req, res) {
  try {
    const serviceId = req.params.serviceId;

    const service = await Service.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const bookingsToUpdate = await Booking.find({ _id: { $in: service.bookings } });
    
    for (const booking of bookingsToUpdate) {
      //find the resource and remove the booking from the resource
      const resourceToRemoveId = booking.resource;
      const resourceToRemove =  await Resource.findById(resourceToRemoveId);
      const bookingIndex = resourceToRemove.bookings.indexOf(booking._id);
      if (bookingIndex !== -1) {
        resourceToRemove.bookings.splice(bookingIndex, 1);
        await resourceToRemove.save();
      }
      const previousStatus = booking.status;
      booking.status = 'Cancelled';
      await logStatusChange(booking._id, previousStatus, 'Cancelled');
      await booking.save();
      }

    const resources = service.resource;

    for (const resourceId of resources) {
      const resource = await Resource.findById(resourceId);

      const index = resource.serviceId.indexOf(serviceId);
      
      if (index !== -1) {
        resource.serviceId.splice(index, 1);
        await resource.save();
        console.log(`Service ${serviceId} removed from resource ${resource._id}`);
    }
}

    await Service.findByIdAndDelete(serviceId);

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = deleteService;
