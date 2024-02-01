const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
    ,
    description: {
        type: String,
        required: true
    },
    host: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true }
});

const events = mongoose.model("events", eventSchema);

module.exports = events;
