const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const profileController = {
    profile: async (req, res) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token is missing' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            const userId = decoded.id;

            const user = await Patient.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const res_data = {
                "userName": user.name,
                "email": user.email,
                "phone": user.phone_number,
                "date": user.d_o_b,
                "ID": user.ssn,
            }
            return res.status(200).json(res_data);
        } catch (error) {
            return res.status(401).json({ error: 'Token is invalid' });
        }
    }
};

module.exports = profileController;
