const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Lab = require('../models/lab');
const Government = require('../models/government');
const { currentIP } = require('../utils/network');

const dotenv = require('dotenv');

dotenv.config();

const profileController = {
    getMyProfile: async (req, res) => {
        try{
            const userId = req.user;
            const userType = req.type;
            let user = null

            if(userType === 'p') {
                user = await Patient.findById(userId);    
            }else if(userType === 'd'){
                user = await Doctor.findById(userId);    
            }else if (userType === 'l') {
                user = await Lab.findById(userId);
            }else if (userType === 'g') {
                user = await Government.findById(userId);
            }

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const pp = user.profile_picture.startsWith("https://")? user.profile_picture : `http://${currentIP}:5000/images/${user.profile_picture}`
            const responseData = {
                "name": user.name,
                "email": user.email,
                "phone": user.phone_number,
                "profile_image": pp,
                "user_name": (userType !== 'g')? user.username: undefined,
                "gender": (userType === 'p' || userType === 'd') ? user.gender : undefined,
                "location": (userType === 'd' || userType === 'l' || userType === 'g') ? user.location : undefined,
                "government": (userType === 'd' || userType === 'l') ? user.government : undefined,
                "department": userType === 'd'? user.department: undefined,
                "birthdate": (userType === 'p' || userType === 'd') ? user.birthdate : undefined,
                "ssn": (userType === 'p' || userType === 'd') ? user.ssn : undefined,
            }
            return res.status(200).json(responseData);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    getProfile: async (req, res) => {
        const userId = req.query.userId;
        try {
            let userType = "p";
            let user = await Patient.findById(userId);

            if(!user) {
                user = await Doctor.findById(userId); 
                userType = "d"
            }
            if (!user) {
                user = await Lab.findById(userId);    
                userType = "l"
            }
            if (!user) {
                user = await Government.findById(userId);    
                userType = "l"
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const pp = user.profile_picture.startsWith("https://")? user.profile_picture : `http://${currentIP}:5000/images/${user.profile_picture}`
            // Constructing response data
            const responseData = {
                "name": user.name,
                "email": user.email.visible? user.email.value: undefined,
                "phone": user.phone_number.visible? user.name.value: undefined,
                "profile_image": pp,
                "user_name": (userType !== 'g')? user.username: undefined,
                "gender": (userType === 'p' || userType === 'd') ? user.gender : undefined,
                "location": (userType === 'd' || userType === 'l' || userType === 'g') ? user.location : undefined,
                "government": (userType === 'd' || userType === 'l') ? user.government : undefined,
                "department": userType === 'd' ? user.department : undefined,
                "birthdate": (userType === 'p' || userType === 'd') && user.birthdate.visible ? user.birthdate.value : undefined,
            };

            return res.status(200).json(responseData);
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
    updateProfile: async (req, res) => {
        const { email, name, phone, ID, date, userName, department, gender, government, location} = req.body;
        const userId = req.user;
        const userType = req.type;

        try {
            let user = null
            if (userType === 'p') {
                user = await Patient.findByIdAndUpdate(userId, {
                    email: email,
                    name: name,
                    phone_number: phone,
                    ssn: ID,
                    birthdate: date,
                    gender: gender,
                    username: userName,
                });
            } else if (userType === 'd') {
                user = await Doctor.findByIdAndUpdate(userId, {
                    email: email,
                    name: name,
                    phone_number: phone,
                    ssn: ID,
                    birthdate: date,
                    gender: gender,
                    username: userName,
                    department: department,
                    government: government,
                    location: location
                });
            } else if (userType === 'l') {
                user = await Doctor.findByIdAndUpdate(userId, {
                    email: email,
                    name: name,
                    phone_number: phone,
                    username: userName,
                    department: department,
                    government: government,
                    location: location
                });
            }

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
        const userType = req.type;
        const file = req.file;
        try {
            let user = null;
            if (userType === 'p') {
                user = await Patient.findById(userId);    
            } else if (userType === 'd') {
                user = await Doctor.findById(userId);    
            } else if (userType === 'l') {
                user = await Lab.findById(userId);
            } else if (userType === 'g') {
                user = await Government.findById(userId);
            }

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const updateResult = await user.updateOne({ profile_picture: file.filename });

            if (updateResult.nModified === 0) {
                return res.status(400).json({ error: 'Profile picture could not be updated' });
            }

            return res.status(200).json({ message: 'Profile picture updated successfully' });
        } catch (error) {
            console.error("Error updating profile picture:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = profileController;
