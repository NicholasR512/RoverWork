// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
    // Check if the user is authenticated
    if (req.isAuthenticated()) return next();
    // Redirect to the login page if not authenticated
    res.redirect('/auth/login');
}

// Middleware to ensure the user has a specific role
function ensureRole(roles) {
    return (req, res, next) => {
        // Check if the user is authenticated and has an allowed role
        if (req.isAuthenticated() && roles.includes(req.user.role)) {
            return next();
        }
        // Respond with "Access Denied" if the user does not have permission
        res.status(403).send('Access Denied');
    };
}

// Export the middleware functions
module.exports = { ensureAuthenticated, ensureRole };
