const Service = require('../models/services');
const Resource = require('../models/resources');
const Booking = require('../models/bookings');
const logStatusChange = require('../controllers/statusLogger');

// DELETE route to delete a resource
async function deleteResource(req, res) {
  try {
    const resourceId = req.params.resourceId;

    // Find the resource to be deleted
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Update the status of bookings associated with the resource to "Cancelled"
    const bookingsToUpdate = await Booking.find({ _id: { $in: resource.bookings } });
    
    for (const booking of bookingsToUpdate) {
        const previousStatus = booking.status;
        booking.status = 'Cancelled';
        await logStatusChange(booking._id, previousStatus, 'Cancelled');
        await booking.save();
      }

    // Find all services that have this resource
    const services = resource.serviceId;

    // Update each service to remove the resourceId from its resources array
    for (const serviceId of services) {
        const service = await Service.findById(serviceId);
        console.log(service.resource);
        const index = service.resource.indexOf(resourceId);
        // If the resourceId exists in the resources array (index is not -1), remove it
        if (index !== -1) {
          // Remove the element at the found index from the resources array using splice
          service.resource.splice(index, 1);
          // Save the updated service
          await service.save();
          console.log(`Resource ${resourceId} removed from service ${service._id}`);
      
    }
}

    // // Delete the resource
    await Resource.findByIdAndDelete(resourceId);

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = deleteResource;
