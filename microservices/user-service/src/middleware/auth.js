const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

const signToken = (user) =>
    jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

// Accepts "Authorization: Bearer <token>"
const verifyToken = (req, res, next) => {
    const header = req.headers['authorization'] || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : header;

    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    return next();
};

module.exports = {
    signToken,
    verifyToken,
};
