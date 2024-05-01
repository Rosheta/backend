const Patient = require('../models/patient');
const dotenv = require('dotenv');

dotenv.config();

const profileController = {
    getMyProfile: async (req, res) => {
        try{
            const userId = req.user;
            const user = await Patient.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const responseData = {
                "userName": user.name,
                "email": user.email.value,
                "phone": user.phone_number.value,
                "date": user.d_o_b.value,
                "ID": user.ssn.value,
                "profileImage": user.profile_picture,
                "viewemail": user.email.visible,
                "viewphone": user.phone_number.visible,
                "viewdate": user.d_o_b.visible,
                "viewID": user.ssn.visible

            }
            return res.status(200).json(responseData);
        } catch (error) {
            console.error("Error updating profile picture:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    getProfile: async (req, res) => {
        const userId = req.query.userId;
        try {
            const user = await Patient.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Constructing response data
            const responseData = {
                "userName": user.name,
                "email": user.email.value,
                "phone": user.phone_number.value,
                "date": user.d_o_b.value,
                "ID": user.ssn.value,
                "profileImage": user.profile_picture,
                "viewemail": user.email.visible,
                "viewphone": user.phone_number.visible,
                "viewdate": user.d_o_b.visible,
                "viewID": user.ssn.visible
            };

            return res.status(200).json(responseData);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    updateProfile: async (req, res) => {
        const { userID, email, name, phone, ssn, birthdate } = req.body;
        const userId = req.user;

        try {
            const user = await Patient.findByIdAndUpdate(userId, {
                email: { value: email },
                name: name,
                phone_number: { value: phone },
                ssn: { value: ssn },
                d_o_b: { value: birthdate }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json({ message: "updated profile successfully" });
        } catch (error) {
            console.error("Error updating user profile:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    updateProfilePicture: async (req, res) => {
            const userId = req.user;
            const { profileImage } = req.body;

            try {
                const user = await Patient.findById(userId);

                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                user.profile_picture = profileImage;
                await user.save();

                return res.status(200).json({ message: 'Profile picture updated successfully' });
            } catch (error) {
                console.error("Error updating profile picture:", error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
};

module.exports = profileController;
