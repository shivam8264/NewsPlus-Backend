const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

router.get('/messages', async (req, res) => {
    try {
        const comments = await Comment.find().sort({ timestamp: 1 });
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving comments', error: error.message });
    }
});

module.exports = router;