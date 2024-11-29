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

const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
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





const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Step 1: Find admin by email
    const admin = await adminModel.findByEmail(email);

    if (!admin) {
      return res.status(404).json({ error: "Admin with this email does not exist." });
    }

    // Step 2: Generate reset token
    const resetToken = generateResetToken();
    const tokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Step 3: Save reset token and expiry in `password_resets` table
    await adminModel.savePasswordReset(admin.admin_id, resetToken, tokenExpiry);

    // Step 4: Generate reset link
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or any other email provider
      auth: {
        user: 'lloydiiitech@gmail.com', // Replace with your email
        pass: 'okqa qucp hgpg vnzv'  
      },
    });

    // Step 5: Send email
    const mailOptions = {
      from: "your_email@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: `<p>Hi ${admin.username},</p>
             <p>You requested to reset your password. Click the link below to reset it:</p>
             <a href="http://localhost:8080/reset-password?token=${resetToken}">Reset Password</a>
             <p>If you didn't request this, you can safely ignore this email.</p>`,
    };
    
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};



const updateAdmin = async (req, res) => {
  const { id } = req.params; // Admin ID from request parameters
  const { username, email, location, contact } = req.body;
  const imageFile = req.file; // The uploaded image, if provided

  try {
    // Fetch the existing admin data
    const existingAdmin = await adminModel.findById(id);

    if (!existingAdmin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    // Update the profile image if a new one is uploaded
    const userImage = imageFile?.filename || existingAdmin.userImage;

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
      userImage,
    };

    // Call the model's updateAdmin function
    const result = await adminModel.updateAdmin(id, updatedAdminData);

    if (!result) {
      return res.status(500).json({ error: "Failed to update admin." });
    }

    res.status(200).json({ message: "Admin updated successfully.", data: result });
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: "An error occurred while updating the admin." });
  }
};

const changePassword = (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const adminId = req.adminId; // Assuming adminId is stored in JWT payload

  // Check if the new passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New password and confirmation do not match' });
  }

  // Fetch the current password from the database
  const sql = 'SELECT password FROM admins WHERE admin_id = ?';
  db.query(sql, [adminId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const storedPassword = result[0].password;

    // Compare the current password with the stored password
    bcrypt.compare(currentPassword, storedPassword, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Error comparing passwords' });
      }
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash the new password before saving it
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: 'Error hashing new password' });
        }

        // Update the password in the database
        adminModel.updatePassword(adminId, hashedPassword, (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Error updating password' });
          }

          res.status(200).json({ message: 'Password updated successfully' });
        });
      });
    });
  });
};


module.exports = {
  generateResetToken,
  register,
  upload,
  login,
  verifyEmailController,
  forgotPassword,
  updateAdmin,
  changePassword 
};
