// Import express and initialize router
const express = require('express');
const router = express.Router();

// Route to render the index page
router.get('/', async (req, res) => {
    res.render('index', { user: req.user }); // Pass the current user to the view
});

// Export the router
module.exports = router;
