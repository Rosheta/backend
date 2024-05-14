const Patient = require('../models/patient');
const Government = require('../models/government');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const chatsController = require('../controller/chats');
const pushNotificationsController = require('./push_notifications');

dotenv.config();

const JWT_REMOTE_ACCESS_SECRET = process.env.JWT_REMOTE_ACCESS_SECRET;
const JWT_REMOTE_ACCESS_EXPIRE = process.env.JWT_REMOTE_ACCESS_EXPIRE;

// Function to generate a UUID
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateToken(patientUsername,doctorUsername){
    const payload = {
        patientUsername: patientUsername,
        doctorUsername : doctorUsername,
        uniqueId: uuid(), // Add a unique identifier to the payload
    };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_REMOTE_ACCESS_SECRET, { expiresIn:  JWT_REMOTE_ACCESS_EXPIRE});
    return token;
}

const emergencyController = {
    generateToken: async (req, res) => {
        const patient_ssn = req.query.patient_ssn;
        
        // check that the patient is in the database
        const patient = await Patient.findOne({ ssn : patient_ssn });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // verify that the user calling this function is special user for emergency cases
        let userId = req.user;
        let userType = req.type;
        const government = await Government.findById(userId);
        if(!government || userType != 'g'){
            return res.status(404).json({ error: 'You do not have access to this data' });
        }

        // if all is good, send message to the patient that this user saw his data
        const emergencyMessage = chatsController.sendEmergency(userId,patient._id);
        if(!emergencyMessage) res.status(404).json({ error: 'Error sending emergency message' });

        // and generate token to this user to see the data
        const token = generateToken(patient.username,government.username); 
        res.status(200).json({
            token: token,
        });
    }
};

module.exports = emergencyController;