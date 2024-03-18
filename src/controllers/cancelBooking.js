const Booking = require('../models/bookings');
const Resource = require('../models/resources');
const logStatusChange = require('../controllers/statusLogger');

// DELETE route to cancel a booking

async function cancelBooking(req, res){
  try {
    const bookingId = req.params.bookingId;

    // Find the booking to be canceled
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Find the resource associated with the booking
    const resourceId = booking.resource;
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Remove the booking from the resource's bookings array
    const updatedBookings = resource.bookings.filter(id => id.toString() !== bookingId);
    resource.bookings = updatedBookings;
    // Save the updated resource
    await resource.save();


    //find the service associated with the booking
    const serviceId = booking.service;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Remove the booking from the service's bookings array
    const updatedServiceBookings = service.bookings.filter(id => id.toString() !== bookingId);
    service.bookings = updatedServiceBookings;

    await service.save();

    const previousStatus= booking.status;
    booking.status = 'Cancelled';
    await logStatusChange(bookingId, previousStatus, booking.status);

    await booking.save();

    res.json({ message: 'Booking cancelled successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = cancelBooking;
