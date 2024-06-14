// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = "2b0cdb17e05a2f48a839e2a73fbf9d49567d3099340b4b9dbf7e1d8e8f52e707";

// ROUTE 1: Create a User using: POST "api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Please Enter a Valid Name.').isLength({ min: 2 }),
    body('email', 'Please Enter a Valid Email.').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "Email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });

        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({success, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }
});

// ROUTE 2: Authenticate a User using: POST "api/auth/login". No login required
router.post('/login', [
    body('email', 'Please Enter a Valid Email.').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success=false
            return res.status(400).json({ error: "Please enter valid credentials." });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success=false
            return res.status(400).json({ success,error: "Please enter valid credentials." });
        }

        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
        success=true
        res.json({success,authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }
});

// ROUTE 3: Get LoggedIn User Details using: POST "api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error.");
    }
});

module.exports = router;
