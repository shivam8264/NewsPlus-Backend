const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchuser');
const ContactMessage = require('../models/Contact');
const { body, validationResult } = require('express-validator');

// Route to submit contact form using: POST "/api/contact/submit"
router.post('/submit', fetchUser, [
    body('Name', 'Name is required').not().isEmpty(),
    body('email', 'Enter a valid email').isEmail(),
    body('message', 'Message cannot be empty').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { Name, email, message } = req.body;

    try {
        const contactMessage = new ContactMessage({
            userId: req.user.id,
            Name,
            email,
            message
        });

        const savedMessage = await contactMessage.save();
        res.json({ success: true, message: savedMessage });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
