const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

router.get('/user-count', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ userCount });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
