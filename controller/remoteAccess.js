const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');

dotenv.config();


const remoteAccessController = {
    getFile : async (req,res) => {
        const token = req.query.token;
        const fileHash = req.query.fileHash;

        // verify the token itself
        try {
            // Verify the token
            const decoded = jwt.verify(token, JWT_REMOTE_ACCESS_SECRET);
            const { patientUsername, doctorUsername, uniqueId } = decoded;

            // verify the username in the token is the same as the requested one
            let userId = req.user;
            let user = await Doctor.findById(userId);
            if(user.username != doctorUsername) return res.status(401).json({ message: 'You do not have access to this file' });


            // next, get the file from the patient files and return it
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Invalid token' });
        }
        
    }
};

module.exports = remoteAccessController;