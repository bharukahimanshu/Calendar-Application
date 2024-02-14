const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const authRoutes = require('./src/routes/authRoutes.js');
const rsvp = require('./src/routes/rsvp.js') 
const createEvents= require('./src/routes/createEvents.js')
const editEvents = require('./src/routes/editEvents.js')
const home = require('./src/routes/home.js')
const invitations= require('./src/routes/invitations.js')
const deleteEvent= require('./src/routes/deleteEvent.js')
const { connectToMongoDB } = require('./mongodb.js');
const flash = require('connect-flash');
const cors = require('cors');
const eventDetails = require('./src/routes/eventDetails.js')
require('dotenv').config();


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const publicDirectoryPath = path.join(__dirname, 'public');

// Set up middleware to serve static files
app.use(express.static(publicDirectoryPath));


const mongoUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}`;

app.use(session(
    { secret: 'your-secret-key', 
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
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    preflightContinue: true, 
  };

app.use(cors(corsOptions));

app.use(passport.initialize());
app.use(passport.session());

// Include Passport.js configuration
require('./src/config/passport-config.js');
// Set up static views directory
app.set('views', path.join(__dirname,'src','views'));

// Connect to MongoDB
connectToMongoDB();

// Use authentication routes
app.use('/auth', authRoutes);

app.use('/api', rsvp);

app.use('/api', createEvents);

app.use('/api', eventDetails);

app.use('/api', home);

app.use('/api', invitations);

app.use('/api', editEvents);

app.use('/api', deleteEvent);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});