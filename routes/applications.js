// Import necessary modules
const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');
const Application = require('../models/application');
const Job = require('../models/job');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Display application form for a specific job
router.get('/apply/:jobId', async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId); // Fetch the job by ID
        if (!job) {
            return res.status(404).send('Job not found'); // Return 404 if job is not found
        }
        res.render('application', { job, currentUser: req.user }); // Render the application form
    } catch (err) {
        console.error('Error fetching job:', err);
        res.redirect('/jobs'); // Redirect to jobs page on error
    }
});

// Handle application submission
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const { applicantName, email, phone, coverLetter, jobId } = req.body;

        // Fetch the job by ID
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).send('Job not found'); // Return 404 if job is not found
        }

        // Save the application to the database
        const application = new Application({
            applicantName,
            email,
            phone,
            resume: req.file.path, // Path to uploaded resume
            coverLetter,
            jobId,
        });

        await application.save(); // Save the application

        // Configure the email transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Email service provider
            auth: {
                user: process.env.EMAIL_USER, // Your email username from environment variables
                pass: process.env.EMAIL_PASS, // Your email password from environment variables
            },
        });

        // Configure the email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender's email
            to: job.businessEmail, // Recipient's email (business email for the job)
            subject: `New Application for ${job.title}`, // Email subject
            html: `
                <h1>New Job Application</h1>
                <p><strong>Applicant Name:</strong> ${applicantName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Cover Letter:</strong> ${coverLetter || 'Not provided'}</p>
                <p><a href="${req.protocol}://${req.get('host')}/${req.file.path}" target="_blank">View Resume</a></p>
            `, // Email content
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        req.flash('success', 'Application Successfully Submitted!'); // Flash success message
        res.redirect('/jobs'); // Redirect to jobs page
    } catch (err) {
        console.error('Error submitting application or sending email:', err);
        res.status(500).send('Failed to submit application.'); // Respond with error on failure
    }
});

// Export the router
module.exports = router;
