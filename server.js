// Load environment variables in development mode
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Import dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/user');
const contactRoute = require('./routes/contact');
const applicationRoutes = require('./routes/applications');

// Import routers
const indexRouter = require('./routes/index');
const jobRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Use middleware
app.use(methodOverride('_method')); // Support HTTP method overrides
app.use(express.static('public')); // Serve static files
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false })); // Parse URL-encoded bodies

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error)); // Log connection errors
db.once('open', () => console.log('Connected to MongoDB!')); // Confirm connection success

// Passport Configuration
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email }); // Find user by email
            if (!user) return done(null, false, { message: 'No user with that email' });
            if (!(await user.isValidPassword(password))) return done(null, false, { message: 'Incorrect password' });
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => done(null, user.id)); // Serialize user ID
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Find user by ID
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Session Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default_secret', // Secret for session encryption
        resave: false, // Avoid resaving unchanged sessions
        saveUninitialized: false, // Avoid saving empty sessions
    })
);

// Flash Messages Middleware
app.use(flash());


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Global Variables Middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // Add logged-in user to response locals
    res.locals.successMessage = req.flash('success'); // Flash success messages
    res.locals.errorMessage = req.flash('error'); // Flash error messages
    next();
});

// Use routers
app.use('/', indexRouter); // Root route
app.use('/jobs', jobRouter); // Job routes
app.use('/auth', authRouter); // Authentication routes
app.use('/admin', adminRouter); // Admin routes
app.use('/contact', contactRoute); // Contact routes
app.use('/applications', applicationRoutes); // Application routes

app.use('/uploads', express.static('uploads'));


// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`); // Log server start
});
