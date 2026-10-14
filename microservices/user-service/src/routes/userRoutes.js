const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// User registration
router.post('/register', userController.registerUser);

// User authentication
router.post('/login', userController.authenticateUser);

// Get user profile
router.get('/profile', verifyToken, userController.getUserProfile);

module.exports = router;
