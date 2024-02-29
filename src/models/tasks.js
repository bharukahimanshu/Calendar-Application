const mongoose = require('mongoose');

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
  status: {
    type: String,
    enum: ['Open', 'In-progress', 'Waiting', 'Closed'],
    default: 'Open'
  },
  statusChangeHistory: [{
      _id: false,
      previousStatus: {
          type: String,
          enum: ['Open', 'In-progress', 'Waiting', 'Closed'],
          required: true
      },
      newStatus: {
          type: String,
          enum: ['Open', 'In-progress', 'Waiting', 'Closed'],
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
  related_to:{
    type: String,
    default:'91123456789'  
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;  