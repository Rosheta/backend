const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Lab = require('../models/lab');

const blockchainMiddleware = {
  getUsername: async (req, res, next) => {
        try {
            const userId = req.user;
            const userType = req.type;
            let user = null

            if (userType === 'p') {
                user = await Patient.findById(userId);
            } else if (userType === 'd') {
                user = await Doctor.findById(userId);
            } else if (userType === 'l') {
                user = await Lab.findById(userId);
            }

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            req.username = user.username
            req.block_pass = user.block_pass
            next();
        } catch (error) {
            console.error("Error updating profile picture:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
  }
};

module.exports = blockchainMiddleware;