// Import necessary modules
const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

// Register Page - Render the registration form
router.get('/register', (req, res) => {
    res.render('auth/register', { errorMessage: null });
});


// Handle user registration
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body; // Extract form data
    try {
        const user = new User({ username, email, password, role }); // Create a new user instance
        await user.save(); // Save the user to the database
        res.redirect('/auth/login'); // Redirect to login page on success
    } catch (err) {
        console.error(err);
        res.render('auth/register', { errorMessage: 'Error creating account' }); // Render form with error message
    }
});

// Login Page - Render the login form
router.get('/login', (req, res) => {
    res.render('auth/login', { errorMessage: req.flash('error') }); // Render login page with potential error message
});

// Handle user login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/', // Redirect to homepage on successful login
    failureRedirect: '/auth/login', // Redirect to login page on failure
    failureFlash: true // Enable flash messages for errors
}));

// Logout - Handle user logout
router.get('/logout', (req, res) => {
    req.logout(err => { // Logout the user
        if (err) return next(err); // Handle any errors
        res.redirect('/'); // Redirect to homepage after logout
    });
});

// Export the router
module.exports = router;
