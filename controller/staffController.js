// controllers/StaffController.js
const StaffModel = require('../models/StaffModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const StaffController = {
  addStaff: async (req, res) => {
    const { staffuserName, staffName, staffEmail, staffAddress, contactNumber, mpin } = req.body;

    // Validation: check that all required fields are present
    if (!staffuserName || !staffName || !staffEmail || !staffAddress || !contactNumber || !mpin) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    try {
      // Hash the MPIN
      const hashedMpin = await bcrypt.hash(mpin, 10);

      // Create a token for the new staff member
      const token = jwt.sign(
        { staffuserName, staffEmail }, 
        process.env.JWT_SECRET || 'your_jwt_secret', 
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      // Prepare the data for the database
      const staffData = {
        staffuserName,
        staffName,
        staffEmail,
        staffAddress,
        contactNumber,
        mpin: hashedMpin,
        token
      };

      // Call the model function to add staff
      StaffModel.addStaff(staffData, async (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to add staff member.' });
        }

        // Send the verification email
        try {
          // Create a transporter for Nodemailer
          const transporter = nodemailer.createTransport({
            service: 'gmail', // Or use another service if needed
            auth: {
              user: process.env.EMAIL_USER, // Your email (e.g., 'your-email@gmail.com')
              pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
            }
          });

          // Set up the email data
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: staffEmail,
            subject: 'Staff Account Verification',
            html: `
              <p>Hi ${staffName},</p>
              <p>Thank you for registering as a staff member. Please click the button below to verify your account:</p>
              <a href="http://localhost:5000/staff/verify-account/${token}" style="background-color: #4CAF50; color: white; padding: 15px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Account</a>
              <p>If you did not register for an account, please ignore this email.</p>
            `,
          };

          // Send the email
          await transporter.sendMail(mailOptions);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          return res.status(500).json({ error: 'Failed to send verification email.' });
        }

        res.status(201).json({ 
          message: 'Staff member added successfully!', 
          data: results, 
          token // Include the generated token in the response
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = StaffController;
