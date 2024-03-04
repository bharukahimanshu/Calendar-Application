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
    tasks: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'tasks' 
        }]

});

const customers = mongoose.model("customers", customerSchema);

module.exports = customers;
