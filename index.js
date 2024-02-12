const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const authRoutes = require('./src/routes/authRoutes.js');
const rsvp = require('./src/routes/rsvp.js') 
const createEvents= require('./src/routes/createEvents.js')
const { connectToMongoDB } = require('./mongodb.js');
const flash = require('connect-flash');
const cors = require('cors');
const eventDetails = require('./src/routes/eventDetails.js')


app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const mongoUrl = 'mongodb+srv://bharukahimanshu02:Mongo@calendar.ijsjeg2.mongodb.net/';

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
    origin: 'http://localhost:5173',
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
app.use('/', authRoutes);
app.use('/', rsvp);

app.use('/', createEvents);
app.use('/', eventDetails);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});