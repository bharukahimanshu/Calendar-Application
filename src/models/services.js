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
  }]
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
