const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true  
    },
    phone_no:{
        type: String,
        required: true  
    },
    role:{
        type: String,
        enum: ['Admin', 'Agent'],
        default: 'Agent'       

    },
    tasks:[{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'tasks'
    }]
});

const users = mongoose.model("users", UserSchema);

module.exports = users;
