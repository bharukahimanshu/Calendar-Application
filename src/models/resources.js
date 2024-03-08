const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone_no:{
        type: String,
        required: false 
    },
    description:{
        type: String,
        required: false 
    },
    serviceId:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'service'      
    }],
    bookings:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'bookings'   
    }]
    
    
});

const resources = mongoose.model("Resources", resourceSchema);

module.exports = resources;
