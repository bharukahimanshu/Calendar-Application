const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: false  
    },
    email: {
        type: String,
        required: false
    },
    phone_no:{
        type: String,
        required: true  
    },
    bookings: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'bookings' // Assuming your model name for bookings is 'Booking'
        }]
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
