const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },
    emails: [{
        type: String,
        required: false
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },

    description: {
        type: String,
        required: false
    },
    host: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    declined: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    maybe: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'}]  
});

const events = mongoose.model("events", eventSchema);

module.exports = events;
