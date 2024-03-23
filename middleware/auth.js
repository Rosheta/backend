const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = {
  authenticate: (req, res, next) => {
    // Get the token from the request header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    // Check if token is present
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Token not provided' });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach the decoded user information to the request object
      req.user = decoded.id;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
};

module.exports = authMiddleware;
