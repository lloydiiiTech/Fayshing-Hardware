const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Handle POST request for registering a new admin
router.post('/register', adminController.upload.single('userImage'), adminController.register);
router.get('/verifyAccount', adminController.verifyEmailController);
router.post('/login', adminController.login);
router.post("/forgot-password", adminController.forgotPassword)

router.put('/update-Admin',adminController.updateAdmin )

router.post('/change-password', authMiddleware, adminController.changePassword);

module.exports = router;
