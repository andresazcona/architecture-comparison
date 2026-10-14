const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { signToken } = require('../middleware/auth');

// Register a new user
exports.registerUser = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'username, email and password are required' });
    }
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        await new User({ username, email, password: passwordHash }).save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }
        res.status(500).json({ message: 'Error registering user' });
    }
};

// Authenticate a user by username or email and return a JWT
exports.authenticateUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!(username || email) || !password) {
        return res.status(400).json({ message: 'username (or email) and password are required' });
    }
    try {
        const user = await User.findOne(username ? { username } : { email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'User authenticated successfully', token: signToken(user) });
    } catch (error) {
        res.status(500).json({ message: 'Error authenticating user' });
    }
};

// Get the profile of the authenticated user
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};
