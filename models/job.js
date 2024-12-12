// Import mongoose library
const mongoose = require('mongoose');

// Define the schema for a job
const jobSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true // Job title is required
    },
    company: { 
        type: String, 
        required: true // Company name is required
    },
    description: { 
        type: String, 
        required: true // Job description is required
    },
    minSalary: { 
        type: Number, 
        required: true // Minimum salary is required
    },
    maxSalary: { 
        type: Number, 
        required: true // Maximum salary is required
    },
    jobType: { 
        type: String, 
        enum: ['Part Time', 'Full Time'], // Allowed job types
        required: true // Job type is required
    },
    city: { 
        type: String, 
        enum: ['Easton', 'Wilson', 'Bethlehem', 'Nazareth'], // Allowed cities
        required: true // City is required
    },
    address: { 
        type: String, 
        required: true // Address is required
    },
    createdAt: { 
        type: Date, 
        default: Date.now // Default to the current date and time
    },
    requiredAge: { 
        type: Number, 
        required: true // Required age is required
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved'], // Approval statuses
        default: 'Pending' // Default status is "Pending"
    },
    businessEmail: { 
        type: String, 
        required: true // Business email is required for applications
    }
});

// Export the job model
module.exports = mongoose.model('Job', jobSchema);
