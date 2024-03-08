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
    workingHours: {
        monday: { type: [String], default: [] }, // Array of time ranges for Monday
        tuesday: { type: [String], default: [] }, // Array of time ranges for Tuesday
        wednesday: { type: [String], default: [] }, // Array of time ranges for Wednesday
        thursday: { type: [String], default: [] }, // Array of time ranges for Thursday
        friday: { type: [String], default: [] }, // Array of time ranges for Friday
        saturday: { type: [String], default: [] }, // Array of time ranges for Saturday
        sunday: { type: [String], default: [] } // Array of time ranges for Sunday
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
