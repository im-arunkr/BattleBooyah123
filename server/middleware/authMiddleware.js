const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// This function checks if a user OR an admin is logged in
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get token from header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Find the user by ID from the token
            // This now handles both user token formats ({ user: { id }}) and admin token formats ({ id })
            const userId = decoded.user?.id || decoded.id;
            
            // 4. Try to find them in the User collection first
            req.user = await User.findById(userId).select('-password');

            // 5. If they are not a regular user, try to find them in the Admin collection
            if (!req.user) {
                req.user = await Admin.findById(userId).select('-password');
            }
            
            if (!req.user) {
                return res.status(401).json({ message: 'User not found, not authorized' });
            }

            next(); // Proceed if a user or admin was found
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// This function checks if the logged-in user is an admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized. Admin access only.' });
    }
};

module.exports = { protect, adminOnly };