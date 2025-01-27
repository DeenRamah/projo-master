const jwt = require('jsonwebtoken');
const UserModel = require('../models/User'); // Replace with the actual path to your user model

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Get token from cookies or header
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access. Please log in.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace `JWT_SECRET` with your actual secret
        const user = await UserModel.findById(decoded.id); // Ensure user exists in the database

        if (!user) {
            return res.status(401).json({ message: 'User not found or session expired.' });
        }

        req.user = user; // Attach user to the request
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authenticateUser;
