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

const validateStaffLogin = async (req, res) => {
    const { email, mpin } = req.body;
  
    console.log('Received login request:', { email, mpin });
  
    if (!email || !mpin) {
      return res.status(400).json({ success: false, message: 'Email and MPIN are required' });
    }
  
    try {
      const staff = await StaffModel.findStaffByEmailAndMpin(email, mpin);
  
      if (staff) {
        // Exclude sensitive data like MPIN before sending
        const { mpin, ...staffData } = staff;
        return res.status(200).json({ success: true, message: 'Login successful', data: staffData });
      } else {
        return res.status(401).json({ success: false, message: 'Incorrect MPIN' });
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
