const Booking = require('../models/bookings');

async function logStatusChange(bookingId, previousStatus, newStatus) {
    try {
      console.log('Logging status change...');
      console.log('Booking ID:', bookingId);
      console.log('Previous Status:', previousStatus);
      console.log('New Status:', newStatus);
      const booking = await Booking.findById(bookingId);
      
      // Check if the new status is different from the previous status
      if (previousStatus !== newStatus) {
        const statusChange = {
          previousStatus,
          newStatus,
          timestamp: new Date(),
        };
  
        await Booking.findByIdAndUpdate(bookingId, {
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
  module.exports = logStatusChange;