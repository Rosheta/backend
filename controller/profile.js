const Patient = require('../models/patient');
const dotenv = require('dotenv');

dotenv.config();

const profileController = {
    profile: async (req, res) => {

        const userId = req.user;
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
    }
};

module.exports = profileController;
