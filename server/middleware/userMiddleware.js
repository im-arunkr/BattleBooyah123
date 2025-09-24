const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectUser = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.user.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found, not authorized' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// ✅ Admin-only middleware
const protectAdmin = async (req, res, next) => {
    await protectUser(req, res, async () => {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: 'Admin access only' });
        }
    });
};

module.exports = { protectUser, protectAdmin };
