// mongoDB.js
const mongoose = require('mongoose');

const connectToMongoDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://<username>:password@calendar.ijsjeg2.mongodb.net/", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB.", error.message);
        process.exit(1); 
    }
};

module.exports = {
    connectToMongoDB,
};
