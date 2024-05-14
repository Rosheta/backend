const Patient = require('../models/patient');
const Government = require('../models/government');
const dotenv = require('dotenv');
const chatsController = require('../controller/chats');
const pushNotificationsController = require('./push_notifications');

dotenv.config();

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
        const token = pushNotificationsController.generateToken(); 
        res.status(200).json({
            token: token,
        });
    }
};

module.exports = emergencyController;