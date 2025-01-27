const jwt = require('jsonwebtoken');
const UserModel = require('../models/User'); // Adjust the path to your User model

/**
 * Middleware to authenticate the user using JWT.
 */
const authenticateUser = async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace `JWT_SECRET` with your actual secret from .env

        // Fetch user details from the database
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found or session expired.' });
        }

        // Attach the user information to the request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

/**
 * Middleware to check user roles or permissions (optional).
 * @param {Array<string>} roles - Array of roles allowed to access the route
 */
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ message: 'User not authenticated.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }

        next();
    };
};

module.exports = {
    authenticateUser,
    authorizeRoles,
};
