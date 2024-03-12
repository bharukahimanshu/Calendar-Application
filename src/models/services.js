const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  resource: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'resource'
  }],
  bookings:[{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'bookings'   
}]
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
