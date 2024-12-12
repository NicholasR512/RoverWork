// Import mongoose library
const mongoose = require('mongoose');

// Define the schema for a message
const messageSchema = new mongoose.Schema({
    userEmail: { 
        type: String, 
        required: true // Email of the student sending the message is required
    },
    subject: { 
        type: String, 
        required: true // Subject of the message is required
    },
    message: { 
        type: String, 
        required: true // Message content is required
    },
    createdAt: { 
        type: Date, 
        default: Date.now // Default to the current date and time
    }
});

// Export the message model
module.exports = mongoose.model('Message', messageSchema);
