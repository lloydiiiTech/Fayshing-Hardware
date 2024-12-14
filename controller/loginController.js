const StaffModel = require('../models/StaffModel');

// Get all staff emails
const getAllEmails = (req, res) => {
    StaffModel.getAllEmails((err, emails) => {
        console.log(emails);
        if (err) {
            console.error('Error in StaffController:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(emails);
    });
};
const bcrypt = require('bcrypt');  // Ensure bcrypt is imported
const validateStaffLogin = async (req, res) => {
  const { email, mpin } = req.body;

  if (!email || !mpin) {
      return res.status(400).json({ success: false, message: 'Email and MPIN are required' });
  }

  try {
      // Fetch staff by email
      const staff = await StaffModel.findStaffByEmail(email);

      if (staff) {
          // Compare the input MPIN with the stored hash
          const isMatch = await bcrypt.compare(mpin, staff.mpin);

          if (isMatch) {
              // Exclude sensitive data like MPIN before sending response
              const { mpin, ...staffData } = staff;
              return res.status(200).json({ success: true, message: 'Login successful', data: staffData });
          } else {
              return res.status(401).json({ success: false, message: 'Incorrect MPIN' });
          }
      } else {
          return res.status(404).json({ success: false, message: 'Staff not found' });
      }
  } catch (error) {
      console.error('Error in validateStaffLogin controller:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
    getAllEmails,
    validateStaffLogin
};
