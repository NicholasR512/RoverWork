// Import mongoose library
const mongoose = require('mongoose');

// Define the schema for a job application
const applicationSchema = new mongoose.Schema({
    applicantName: { 
        type: String, 
        required: true // Applicant's full name is required
    },
    email: { 
        type: String, 
        required: true // Applicant's email is required
    },
    phone: { 
        type: String, 
        required: true // Applicant's phone number is required
    },
    resume: { 
        type: String, 
        required: true // Path to the uploaded resume is required
    },
    coverLetter: { 
        type: String // Optional cover letter text
    },
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true // Reference to the associated job is required
    },
    createdAt: { 
        type: Date, 
        default: Date.now // Default to the current date and time
    }
});

// Export the application model
module.exports = mongoose.model('Application', applicationSchema);
