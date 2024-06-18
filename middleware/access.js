const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Doctor = require('../models/doctor');

dotenv.config();
const JWT_REMOTE_ACCESS_SECRET = process.env.JWT_REMOTE_ACCESS_SECRET;

const accessControlMiddleware = {
  accessControl: async (req, res, next) => {
    // Get the token from the request header
    const token = req.headers.accesscontrol && req.headers.accesscontrol;

    // Check if token is present
    if (!token) {
      return res.status(401).json({ message: 'Access denied. access control Token not provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_REMOTE_ACCESS_SECRET);
        const { patientUsername, doctorUsername, uniqueId } = decoded;

        let userId = req.user;
        let user = await Doctor.findById(userId);

        // verify the username in the token is the same as the requested one
        if (user.username !== doctorUsername) {
            return res.status(401).json({ message: 'You do not have access to this file' });;
        }

        req.patientUsername = patientUsername;
        req.doctorUsername = doctorUsername;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Access control denied' });
    }
  }
};

module.exports = accessControlMiddleware;