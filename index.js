const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const hbs = require('hbs');
const authRoutes = require('./src/routes/authRoutes.js'); 
const createEvents= require('./src/routes/createEvents.js')
const { connectToMongoDB } = require('./mongodb.js');
const flash = require('connect-flash');
const cors = require('cors');


app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

app.use(flash());

app.use(cors);

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

app.use('/', createEvents);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});