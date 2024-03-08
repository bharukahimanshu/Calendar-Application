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
  duration: {
    type: Number,
    required: true // Assuming duration is required for each resoure
},
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
