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

    eventsAttending: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'events' 
        }],
    maybeAttending: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'events' 
        }],
    eventInvitations: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'events' 
        }],
});

const users = mongoose.model("users", UserSchema);

module.exports = users;
