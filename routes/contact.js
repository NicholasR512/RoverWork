// Import necessary modules
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');
const Message = require('../models/message'); // Import the Message model
const nodemailer = require('nodemailer');

// Contact route (accessible to Students only)
router.get('/', ensureAuthenticated, ensureRole(['Student']), (req, res) => {
    res.render('contact', { user: req.user }); // Render the contact form
});

// Save message to the database and send email
router.post('/', ensureAuthenticated, ensureRole(['Student']), async (req, res) => {
    const { subject, message } = req.body;

    try {
        // Save the message to the database
        await Message.create({
            userEmail: req.user.email, // User's email from the session
            subject, // Subject of the message
            message, // Message content
        });

        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Email service provider
            auth: {
                user: process.env.EMAIL_USER, // Sender's email from environment variables
                pass: process.env.EMAIL_PASS, // Sender's password from environment variables
            },
        });

        // Configure the email options
        const mailOptions = {
            from: req.user.email, // Sender's email
            to: 'resslern321@gmail.com', // Replace with your support email
            subject: `Contact Form: ${subject}`, // Email subject
            text: `From: ${req.user.email}\n\nMessage:\n${message}`, // Email content
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        req.flash('success', 'Your message has been sent successfully!'); // Flash success message
        res.redirect('/contact'); // Redirect back to the contact form
    } catch (err) {
        console.error('Error saving message or sending email:', err);
        req.flash('error', 'Failed to send your message. Please try again later.'); // Flash error message
        res.redirect('/contact'); // Redirect back to the contact form on failure
    }
});

// Export the router
module.exports = router;
