// Import mongoose and bcrypt libraries
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for a user
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true // Username must be unique
    },
    email: { 
        type: String, 
        required: true, 
        unique: true // Email must be unique
    },
    password: { 
        type: String, 
        required: true // Password is required
    },
    role: { 
        type: String, 
        enum: ['Student', 'Business', 'Admin'], // Allowed user roles
        required: true // Role is required
    }
});

// Middleware to hash the password before saving the user
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (err) {
        next(err); // Pass the error to Mongoose, so it doesn't crash the app
    }
});


// Method to verify the password
userSchema.methods.isValidPassword = async function (password) {
    // Compare the provided password with the hashed password
    return await bcrypt.compare(password, this.password);
};

// Export the user model
module.exports = mongoose.model('User', userSchema);
