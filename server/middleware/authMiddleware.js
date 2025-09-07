const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check karein ki header me token hai ya nahi
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Header se token nikalein (Bearer aage se hata dein)
            token = req.headers.authorization.split(' ')[1];

            // Token ko verify karein
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Token se user ID nikal kar database se user ka data lein
            // Password ko chhod kar
            req.user = await User.findById(decoded.id).select('-password');
            
            // Check karein ki user admin hai ya nahi
            if (!req.user || req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized, not an admin' });
            }

            // Agar sab sahi hai to agle step par jaane dein
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };

