const nodemailer = require('nodemailer');


exports.forgotPasswordPost = async (req, res) => {
    const { email } = req.body;

    try {
        

        // Create a transporter for sending the email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'lloydiiitech@gmail.com', // Your email address
                pass: 'okqa qucp hgpg vnzv' // Use the app password you generated
            }
        });

        // Define the email options
        const mailOptions = {
            from: 'lloydiiitech@gmail.com', // Sender address
            to: email, // Recipient email
            subject: 'Password Reset',
            html: `
                <p>You requested a password reset. Please click on the link below to reset your password:</p>
                <a href="http://localhost:3000/verifyAccount/${token}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none;">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>
            `
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Inform the user that the email was sent
        req.flash('info', 'A password reset link has been sent to your email.');
        return res.redirect('/forgot-password');
        
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred. Please try again later.');
        return res.redirect('/forgot-password');
    }
};