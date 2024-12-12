// Import necessary modules
const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

// All jobs route (Business sees their jobs, Admin sees all jobs, Students see approved jobs)
router.get('/', ensureAuthenticated, ensureRole(['Student', 'Admin', 'Business']), async (req, res) => {
    try {
        const { search, city, jobType, minSalary, maxSalary, sort } = req.query;

        let query = {};
        if (req.user.role === 'Admin') {
            query = {}; // Admin sees all jobs
        } else if (req.user.role === 'Student') {
            query.status = 'Approved'; // Students see only approved jobs
        } else if (req.user.role === 'Business') {
            query.businessEmail = req.user.email; // Businesses see only their own jobs
        }

        // Apply search by title or description
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') }, // Case-insensitive search in title
                { description: new RegExp(search, 'i') } // Case-insensitive search in description
            ];
        }

        // Filter by city
        if (city) {
            query.city = city;
        }

        // Filter by job type
        if (jobType) {
            query.jobType = jobType;
        }

        // Filter by salary range
        if (minSalary) {
            query.minSalary = { $gte: parseFloat(minSalary) };
        }
        if (maxSalary) {
            query.maxSalary = { $lte: parseFloat(maxSalary) };
        }

        // Apply sorting
        let sortOptions = {};
        if (sort === 'date') {
            sortOptions.createdAt = -1; // Newest first
        } else if (sort === 'salary') {
            sortOptions.minSalary = 1; // Ascending salary
        }

        // Fetch filtered and sorted jobs
        const jobs = await Job.find(query).sort(sortOptions);

        res.render('jobs/index', { jobs, query: req.query, user: req.user });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.redirect('/');
    }
});

// New job route (accessible to Businesses only)
router.get('/new', ensureAuthenticated, ensureRole(['Business']), (req, res) => {
    res.render('jobs/new', { job: new Job() });
});

// Add job route (accessible to Businesses only)
router.post('/', ensureAuthenticated, ensureRole(['Business']), async (req, res) => {
    const job = new Job({
        title: req.body.title,
        company: req.body.company,
        description: req.body.description,
        minSalary: parseFloat(req.body.minSalary),
        maxSalary: parseFloat(req.body.maxSalary),
        jobType: req.body.jobType,
        city: req.body.city,
        address: req.body.address,
        requiredAge: Number(req.body.requiredAge),
        status: 'Pending', // Default status
        businessEmail: req.user.email // Automatically set from logged-in user
    });

    try {
        await job.save();
        res.redirect('/jobs');
    } catch (err) {
        console.error('Error creating job:', err);
        res.render('jobs/new', {
            job,
            errorMessage: 'Error Creating Job...'
        });
    }
});

// Display pending jobs for Admin
router.get('/pending', ensureAuthenticated, ensureRole(['Admin']), async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'Pending' }); // Fetch jobs with status 'Pending'
        res.render('jobs/pending', { jobs });
    } catch (err) {
        console.error('Error fetching pending jobs:', err);
        res.redirect('/');
    }
});

// Show job route (accessible to Students, Admins, and Businesses)
router.get('/:id', ensureAuthenticated, ensureRole(['Student', 'Admin', 'Business']), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        res.render('jobs/show', { job });
    } catch (err) {
        console.error('Error fetching job details:', err);
        res.redirect('/');
    }
});

// Edit job route (accessible to Admins and the Business who posted it)
router.get('/:id/edit', ensureAuthenticated, ensureRole(['Admin', 'Business']), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        res.render('jobs/edit', { job });
    } catch (err) {
        console.error('Error fetching job for editing:', err);
        res.redirect('/jobs');
    }
});

// Update job route (accessible to Admins and the Business who posted it)
router.put('/:id', ensureAuthenticated, ensureRole(['Admin', 'Business']), async (req, res) => {
    let job;
    try {
        job = await Job.findById(req.params.id);
        job.title = req.body.title;
        job.company = req.body.company;
        job.description = req.body.description;
        job.minSalary = req.body.minSalary;
        job.maxSalary = req.body.maxSalary;
        job.jobType = req.body.jobType;
        job.city = req.body.city;
        job.address = req.body.address;
        job.requiredAge = req.body.requiredAge;

        await job.save();
        res.redirect(`/jobs/${job.id}`);
    } catch (err) {
        console.error('Error updating job:', err);
        if (job == null) {
            res.redirect('/');
        } else {
            res.render('jobs/edit', {
                job,
                errorMessage: 'Error Updating Job...'
            });
        }
    }
});

// Delete job route (accessible to Admins and the Business who posted it)
router.delete('/:id', ensureAuthenticated, ensureRole(['Admin', 'Business']), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        await job.deleteOne();
        res.redirect('/jobs');
    } catch (err) {
        console.error('Error deleting job:', err);
        res.redirect('/jobs');
    }
});

// Approve a job (Admin only)
router.post('/:id/approve', ensureAuthenticated, ensureRole(['Admin']), async (req, res) => {
    try {
        await Job.findByIdAndUpdate(req.params.id, { status: 'Approved' });
        res.redirect('/jobs/pending');
    } catch (err) {
        console.error('Error approving job:', err);
        res.redirect('/jobs/pending');
    }
});

// Reject (delete) a job (Admin only)
router.post('/:id/reject', ensureAuthenticated, ensureRole(['Admin']), async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.redirect('/jobs/pending');
    } catch (err) {
        console.error('Error rejecting job:', err);
        res.redirect('/jobs/pending');
    }
});

// Export the router
module.exports = router;
