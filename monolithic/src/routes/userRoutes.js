const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// User registration
router.post('/register', userController.registerUser);

// User authentication
router.post('/login', userController.authenticateUser);

// Get user profile
router.get('/profile', userController.getUserProfile);

module.exports = router;