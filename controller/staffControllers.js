const StaffModel = require('../models/StaffModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/xampp/htdocs/loginVue/uploads/staff'); // Specify where the image files should be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Name the image based on the timestamp
  }
});

const upload = multer({ storage: storage });

const addStaff = async (req, res) => {
  const { staffuserName, staffName, staffEmail, staffAddress, contactNumber, mpin } = req.body;
  const imageFile = req.file; // The uploaded image

  // Save the full path (e.g., 'uploads/filename.jpg') in userImage
  const userImage = imageFile ? `uploads/staff/${imageFile.filename}` : null;

  // Validation: check that all required fields are present
  if (!staffuserName || !staffName || !staffEmail || !staffAddress || !contactNumber || !mpin) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  try {
    // Hash the MPIN
    const hashedMpin = await bcryptjs.hash(mpin, 10);

    // Create a token for the new staff member
    const token = jwt.sign({ staffuserName, staffEmail }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });

    // Prepare the data for the database
    const staffData = {
      staffuserName,
      staffName,
      staffEmail,
      staffAddress,
      contactNumber,
      mpin: hashedMpin,
      token,
      userImage
    };

    // Call the model function to add staff
    StaffModel.addStaff(staffData, async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add staff member.' });
      }

      // Send the verification email
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          }
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: staffEmail,
          subject: 'Staff Registration Successful',
          text: `Dear ${staffName},\n\nYour account has been created successfully.\n\nBest regards,\nYour Team`,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }

      res.status(200).json({ message: 'Staff member added successfully!', data: results });
    });
  } catch (error) {
    console.error("Error adding staff:", error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

  const getAllStaff = (req, res) => {
    StaffModel.getAllStaffs((err, staffData) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch staff data' });
        }
        res.status(200).json({ staffData });
    });
};

const getAllAdmin = (req, res) => {
  StaffModel.getAllAdmin((err, adminData) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to fetch admin data' });
      }
      res.status(200).json({ adminData });
  });
};

const removeStaff = async (req, res) => {
  const staffId = req.params.id;

  try {
    // Call the model function to update the status of the staff to 0 (soft delete)
    const updated = await StaffModel.updateStaffStatus(staffId); // Use the model function here

    if (updated.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Staff not found or already removed' });
    }

    return res.json({ success: true, message: 'Staff removed successfully' });
  } catch (error) {
    console.error('Error removing staff:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const removeAdmin = async (req, res) => {
  const adminId = req.params.id;

  try {
    const updated = await StaffModel.updateAdminStatus(adminId);

    console.log('Query result:', updated); // Debugging log

    if (updated.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found or already removed' });
    }

    return res.json({ success: true, message: 'Admin removed successfully' });
  } catch (error) {
    console.error('Error removing admin:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


module.exports = {
    addStaff,
    getAllStaff,
    getAllAdmin,
    removeStaff,
    removeAdmin
};

