const jwt = require('jsonwebtoken');  // Import the jsonwebtoken package (only once)
const bcryptjs = require('bcryptjs');   // Use bcryptjs for hashing the password
const crypto = require('crypto');
const adminModel = require('../models/adminModel');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

const bufferToBase64 = (buffer) => {
  return buffer.toString('base64');
};



const getBase64Image = async (adminId) => {
  const imageBlob = await getUserImageFromDb(adminId);
  if (imageBlob) {
    return `data:image/jpeg;base64,${bufferToBase64(imageBlob)}`;  // Assuming the image is in JPEG format
  }
  return null;
};

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify where the image files should be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Name the image based on the timestamp
  }
});

const upload = multer({ storage: storage });

// Register controller
const register = async (req, res) => {
  const { username, email, location, contact, password, userRole } = req.body;
  const imageFile = req.file; // The uploaded image

  // If image is uploaded, get its filename; otherwise, set userImage to null
  const userImage = imageFile ? imageFile.filename : null;

  try {
      // Hash the password using bcryptjs
      const hashedPassword = await bcryptjs.hash(password, 10);

      // Generate JWT token
      const token = jwt.sign(
          { email: email, userRole: userRole || 'admin' },
          JWT_SECRET,
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
          userImage
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
              <img src="http://localhost:3000/uploads/${userImage}" alt="Profile Picture" width="200" height="200" />
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
              pass: 'okqa qucp hgpg vnzv'      // Replace with your email password (use environment variable in real apps)
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

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findByEmail(email);

    if (!admin) {
      console.log('No admin found with this email');
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if the account is verified
    if (admin.status !== 1) {
      console.log('Admin account is not verified');
      return res.status(400).json({ error: 'This account is not verified. Please verify your account before logging in.' });
    }

    // Verify password
    const isMatch = await bcryptjs.compare(password, admin.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful, token generated:', token);

    return res.json({
      email: admin.email,
      token,
      message: 'Login successful!',
      status: admin.status,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};








module.exports = {
  register,
  upload,
  login,
  verifyEmailController,
 
};
