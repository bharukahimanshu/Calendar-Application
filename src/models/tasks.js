const mongoose = require('mongoose');

// Defining Task schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  related_to: {
    type: String,
  },
  creator:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user'
    
  },
  status: {
    type: String,
    enum: ['Pending', 'Cancelled', 'Completed'],
    default: 'Pending'
  },
  statusChangeHistory: [{
    _id: false,
    previousStatus: {
      type: String,
      enum: ['Pending', 'Cancelled', 'Completed'],
      required: true
    },
    newStatus: {
      type: String,
      enum: ['Pending', 'Cancelled', 'Completed'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

// Creating Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
