const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'No account found with that email address' });
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpire = Date.now() + 3600000;
        user.resetToken = resetToken;
        user.resetTokenExpire = resetTokenExpire;
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: 'Password Reset Request - NewsPlus',
            text: `Hello ${user.name},
        
        We received a request to reset your password for your NewsPlus account. Please click the link below to reset your password:
        
        ${resetUrl}
        
        If you did not request this change, you can safely ignore this email—your account will remain secure.
        
        Thank you for choosing NewsPlus.
        
        Best regards,
        The NewsPlus Team`
        };        

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Password reset link sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
