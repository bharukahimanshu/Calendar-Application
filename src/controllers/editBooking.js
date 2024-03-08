const Bookings = require('../models/bookings');

async function logStatusChange(bookingId, previousStatus, newStatus) {
  try {
    console.log('Logging status change...');
    console.log('Booking ID:', bookingId);
    console.log('Previous Status:', previousStatus);
    console.log('New Status:', newStatus);
    const booking = await Bookings.findById(bookingId);
    
    // Check if the new status is different from the previous status
    if (previousStatus !== newStatus) {
      const statusChange = {
        previousStatus,
        newStatus,
        timestamp: new Date(),
      };

      await Bookings.findByIdAndUpdate(bookingId, {
        $push: { statusChangeHistory: statusChange },
      });

      await booking.save();
      console.log('Status change logged successfully');
    } else {
      console.log('Status remains unchanged, not logging the status change');
    }

  } catch (error) {
    console.error('Error logging status change:', error);
  }
}

async function editBooking(req, res) {
  try {
    const bookingId = req.params.bookingId;
    const { title, description, dueDate, status, related_to} = req.body;
    const userId = req.user._id;
    console.log(bookingId);

    // Find the booking by ID
    const booking = await Bookings.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.creator.toString()!== userId.toString()) {
      return res.status(403).json({ error: 'You are not authorized to edit this booking' });
    }

    // Update  properties with the provided fields
    const previousStatus = booking.status;

    if (title) booking.title = title;
    if (description) booking.description = description;
    if (dueDate) booking.dueDate = dueDate;
    if (related_to) booking.related_to = related_to;
    if (status) {
      booking.status = status;
      // Log status change
      await logStatusChange(bookingId, previousStatus, status);
    }
      // Save the updated booking
    await booking.save();
    

    res.json({ message: 'booking updated successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = editBooking;
