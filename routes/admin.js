// Import necessary modules and models
const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');
const Job = require('../models/job');
const Message = require('../models/message');

// Admin dashboard - View all jobs
router.get('/', ensureAuthenticated, ensureRole('Admin'), async (req, res) => {
    try {
        const jobs = await Job.find(); // Fetch all jobs from the database
        res.render('admin/index', { jobs }); // Render admin dashboard with jobs
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.redirect('/'); // Redirect to homepage on error
    }
});

// Approve a job
router.post('/jobs/:id/approve', ensureAuthenticated, ensureRole('Admin'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id); // Find the job by ID
        if (!job) {
            return res.status(404).send('Job not found'); // Return 404 if job not found
        }
        job.status = 'Approved'; // Set job status to "Approved"
        await job.save(); // Save the updated job
        res.redirect('/admin'); // Redirect to admin dashboard
    } catch (err) {
        console.error('Error approving job:', err);
        res.redirect('/admin'); // Redirect to admin dashboard on error
    }
});

// Delete a message (Admin only)
router.delete('/messages/:id', ensureAuthenticated, ensureRole(['Admin']), async (req, res) => {
    try {
        const message = await Message.findById(req.params.id); // Find the message by ID
        if (!message) {
            console.error(`Message with ID ${req.params.id} not found.`);
            req.flash('error', 'Message not found.');
            return res.redirect('/admin/messages'); // Redirect if message not found
        }
        await message.deleteOne(); // Delete the message
        req.flash('success', 'Message deleted successfully!');
        res.redirect('/admin/messages'); // Redirect to messages page
    } catch (err) {
        console.error('Error deleting message:', err);
        req.flash('error', 'Failed to delete the message.');
        res.redirect('/admin/messages'); // Redirect on error
    }
});

// Delete a job
router.delete('/jobs/:id', ensureAuthenticated, ensureRole('Admin'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id); // Find the job by ID
        if (!job) {
            console.error(`Job with ID ${req.params.id} not found.`);
            return res.redirect('/admin'); // Redirect if job not found
        }
        await job.deleteOne(); // Delete the job
        res.redirect('/admin'); // Redirect to admin dashboard
    } catch (err) {
        console.error('Error deleting job:', err);
        res.redirect('/admin'); // Redirect on error
    }
});

// View all messages (Admin only)
router.get('/messages', ensureAuthenticated, ensureRole(['Admin']), async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 }); // Fetch all messages, sorted by date
        res.render('admin/messages', { messages }); // Render messages page with data
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.redirect('/'); // Redirect to homepage on error
    }
});

// Export the router
module.exports = router;
