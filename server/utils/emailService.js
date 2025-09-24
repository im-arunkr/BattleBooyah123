const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

// Configure the email transport using SendGrid
const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.SENDGRID_API_KEY,
        },
    })
);

// Function to send the password reset email
const sendPasswordResetEmail = (recipientEmail, resetUrl) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: recipientEmail,
        subject: 'Your Password Reset Request for BattleBooyah',
        // This is the body of the email
        html: `
            <p>You requested a password reset for your BattleBooyah admin account.</p>
            <p>Please click the following link, or paste it into your browser to complete the process:</p>
            <a href="${resetUrl}">${resetUrl}</a>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
};

module.exports = { sendPasswordResetEmail };
