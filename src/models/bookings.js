const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Closed'],
    default: 'Pending'
  },
  statusChangeHistory: [{
    _id: false,
    previousStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Closed'],
      required: true
    },
    newStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Closed'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Assuming you have a Customer model
    required: true
  },
  related_to: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service' // Assuming you have a Service model
  },
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'resources' // Assuming you have a Staff model
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
