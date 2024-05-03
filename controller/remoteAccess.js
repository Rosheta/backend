const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');
const Doctor = require('../models/doctor');

dotenv.config();


// this function verify the token by 2 methods
// 1. verify it's valid token generated with the application secret and didn't expire yet
// 2. verify that the username in the token is the same as the one who sends the request
function ValidateToken(token,requestedUsername){
    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_REMOTE_ACCESS_SECRET);
        const { patientUsername, doctorUsername, uniqueId } = decoded;

        // verify the username in the token is the same as the requested one
        if(requestedUsername !== doctorUsername) return 3;

        return {patientUsername, doctorUsername};

    } catch (error) {
        console.error(error);
        return 2;
    }
}

const remoteAccessController = {
    getFiles : async (req,res) => {
        const token = req.query.token;

        let userId = req.user;
        let user = await Doctor.findById(userId);

        // verify the token
        let validation = ValidateToken(token,user.username);
        if(validation === 2) return res.status(401).json({ message: 'Invalid token' });
        if(validation === 3) return res.status(401).json({ message: 'You do not have access to this file' });

        // get the files of the patient to send it to the doctor
        patientUsername = validation.patientUsername;
        const userFiles = await File.find({ patientUsername });

        const filesList = userFiles.map(file => ({
            Filename: file.fileName,
            Extension: file.extension,
            Hash: file.hash,
            date: file.timestamp 
        }));

        res.status(200).json(filesList);
    },
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
            if(user.username !== doctorUsername) return res.status(401).json({ message: 'You do not have access to this file' });


            // next, get the file from the patient files and return it
            const file = await File.findOne({ fileHash });

            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }

            if (patientUsername !== file.username) {
                return res.status(403).json({ error: 'Unauthorized' });
            }
            const bytes = await ipfsService.getFileFromIPFS(hash);
            const buffer = Buffer.from(bytes);
            res.status(200).send(buffer);
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Invalid token' });
        }
        
    }
};

module.exports = remoteAccessController;