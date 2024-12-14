const multer = require('multer');
const path = require('path');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const adminModel = require('../models/adminModel');

// Define JWT_SECRET directly in the code (NOT recommended for production)
const JWT_SECRET = 'your_secret_key_here';  // Replace with a secure key

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'appdev-AdminSide-View/src/assets/adminProfile');  // Store images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Use a unique filename
    }
});

// Initialize upload middleware
const upload = multer({ storage: storage });

// Register controller
const register = async (req, res) => {
    const { username, email, location, contact, password, userRole } = req.body;
    const imageFile = req.file; // The uploaded image

    // Save the full path (e.g., 'uploads/filename.jpg') in userImage
    const userImage = imageFile ? `${imageFile.filename}` : null;

    try {
        // Hash the password using bcryptjs
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Generate JWT token
        const token = jwt.sign(
            { email: email, userRole: userRole || 'admin' },
            JWT_SECRET,  // Use the JWT_SECRET directly here
            { expiresIn: '1h' }
        );

        // Prepare user data to pass to the model
        const userData = {
            username,
            email,
            location,
            contact,
            password: hashedPassword,
            token,
            userRole,
            userImage // Save full path here
        };

        // Call the model's registerAdmin function to insert the user into the database
        const results = await adminModel.registerAdmin(userData);

        // Prepare the verification email content
        const verificationLink = `http://localhost:8080/verifyAccount?token=${token}`;
        const mailOptions = {
            from: 'your_email@gmail.com',
            to: email,
            subject: 'Email Verification for Your Account',
            html: `
                <img src="http://localhost:3000/${userImage}" alt="Profile Picture" width="200" height="200" />
                <h2>Hello, ${username}</h2>
                <p>Thank you for registering. Please click the link below to verify your email address:</p>
                <a href="${verificationLink}">Verify Email</a>
            `
        };

        // Create the email transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'lloydiiitech@gmail.com', // Replace with your email
              pass: 'okqa qucp hgpg vnzv'   // Replace with your email password (use environment variables in real apps)
            }
        });

        // Send the verification email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending verification email:', error);
            } else {
                console.log('Verification email sent:', info.response);
            }
        });

        // Send response back to the client
        res.status(201).json({ message: 'User registered successfully! Please check your email to verify your account.', data: results });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Failed to register user." });
    }
};


  
const verifyEmailController = async (req, res) => {
    const { token } = req.query;
    const user = await adminModel.getAdminByToken(token);
    const result = await adminModel.verifyEmail(token);
  }
  

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await adminModel.findByEmail(email);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Check password
    const isMatch = await bcryptjs.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check admin status
    if (admin.status !== 1) {
      return res.status(403).json({ error: 'Account not verified' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: admin.user_id, role: admin.user_role },
      'secretKey',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      username: admin.username,
      user_id: admin.user_id,
      user_role: admin.user_role,
      status: admin.status,
      message: 'Login successful',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



const updateAdmin = async (req, res) => {
  const { id } = req.params; // Admin ID from request parameters
  const { username, email, location, contact } = req.body;
  const imageFile = req.file; // The uploaded image file

  try {
    // Fetch the existing admin data from the database
    const existingAdmin = await adminModel.findById(id);

    // If no new image is uploaded, keep the old image; otherwise, update with the new one
    const userImage = imageFile 
      ? `assets/adminProfile/${imageFile.filename}`  // Path for the uploaded image
      : existingAdmin.userImage;  // Keep the existing image if no new one is uploaded

    // Validate and sanitize inputs
    if (!username || !email) {
      return res.status(400).json({ error: "Username and email are required." });
    }

    // Prepare the updated admin data
    const updatedAdminData = {
      username: username.trim(),
      email: email.trim(),
      location: location ? location.trim() : existingAdmin.location,
      contact: contact ? contact.trim() : existingAdmin.contact,
      userRole: existingAdmin.userRole,  // Assuming userRole doesn't change
      userImage,  // This will either be the new image or the existing image
    };

    // Call the model's updateAdmin function to update the admin profile in the database
    const result = await adminModel.updateAdmin(id, updatedAdminData);

    // Return a successful response
    res.status(200).json({ message: "Admin updated successfully.", data: result });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: error.message });
  }
};




const getAdminData = async (req, res) => {
  const adminID = req.params.adminID;

  try {
    const adminData = await adminModel.findById(adminID);

    if (!adminData) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json(adminData);
  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({ error: 'Failed to retrieve admin data' });
  }
};


module.exports = {
  loginAdmin,
  register,
  upload,
  verifyEmailController,
  updateAdmin,
  getAdminData
};
