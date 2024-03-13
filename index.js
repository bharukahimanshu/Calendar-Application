const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const authRoutes = require('./src/routes/authRoutes.js');
const rsvp = require('./src/routes/rsvp.js');
const createEvents = require('./src/routes/createEvents.js');
const createBookings = require('./src/routes/createBookings.js');
const getBookings = require('./src/routes/getBookings.js');
const editEvents = require('./src/routes/editEvents.js');
const editBooking = require('./src/routes/editBooking.js');
const home = require('./src/routes/home.js');
const invitations = require('./src/routes/invitations.js');
const deleteEvent = require('./src/routes/deleteEvent.js');
const { connectToMongoDB } = require('./mongodb.js');
const flash = require('connect-flash');
const cors = require('cors');
const eventDetails = require('./src/routes/eventDetails.js');
const addService = require('./src/routes/addService.js');
const addResource = require('./src/routes/addResource.js');
const getServices = require('./src/routes/getServices.js');
const getAllResources = require('./src/routes/getAllResources.js');
const fetchResources = require('./src/routes/fetchResources.js');
const fetchSlots = require('./src/routes/fetchSlots.js');
const editService = require('./src/routes/editService.js');
const editResource = require ('./src/routes/editResource.js');
const addResourceToService = require('./src/routes/addResourceToService.js')
const cancelBooking = require('./src/routes/cancelBooking.js')
const deleteResource = require('./src/routes/deleteResource.js')
const createTask = require('./src/routes/createTask.js')
const deleteResourceFromService = require('./src/routes/deleteResourceFromService.js')
require('dotenv').config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const publicDirectoryPath = path.join(__dirname, 'public');
app.use(express.static(publicDirectoryPath));

const mongoUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}`;

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl }),
    cookie: {
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));

app.use(flash());
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    preflightContinue: true,
};

app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(passport.session());

require('./src/config/passport-config.js');
app.set('views', path.join(__dirname, 'src', 'views'));

connectToMongoDB();

app.use('/auth', authRoutes);

app.use('/api', rsvp);

app.use('/api', createEvents);

app.use('/api', eventDetails);

app.use('/api', home);

app.use('/api', invitations);

app.use('/api', editEvents);

app.use('/api', deleteEvent);

app.use('/api', createBookings);

app.use('/api', getBookings);

app.use('/api', editBooking);

app.use('/api', addService);

app.use('/api', addResource);

app.use('/api', getServices);

app.use('/api', getAllResources);

app.use('/api', fetchResources);

app.use('/api', fetchSlots);

app.use('/api', editService);

app.use('/api', editResource);

app.use('/api', addResourceToService);

app.use('/api', cancelBooking);

app.use('/api', deleteResource);

app.use('/api', deleteResourceFromService);

app.use('/api', createTask);


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
