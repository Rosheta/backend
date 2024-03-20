const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const chat = require('../models/chat');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const chatController = {
    chats: async (req, res) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token is missing' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            const userId = decoded.id;

            const user = await Patient.findById(userId);

        } catch (error) {
            return res.status(401).json({ error: 'Token is invalid' });
        }
    }
};

module.exports = chatController;