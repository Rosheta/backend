const File = require('../models/file');
const hlf = require('../HLF/contractServices');
const Doctor = require('../models/doctor');

const remoteAccessController = {
    getAllPatientData : async (req,res) => {
        const patientUsername = req.patientUsername

        // get the files of the patient to send it to the doctor
        const userFiles = await File.find({ patientUsername });

        const filesList = userFiles.map(file => ({
            Filename: file.fileName,
            Extension: file.extension,
            Hash: file.hash,
            date: file.timestamp 
        }));

        const PatientId = req.patientUsername;
        const signer = req.patientUsername;
        
        const appointments_data = await hlf.getAllAppointments(PatientId, signer);
        const chronics_data = await hlf.getChronicDieases(PatientId, signer);

        res.status(200).json({
            files: filesList,
            appointments: appointments_data,
            chronics: chronics_data
        });
    },
    getFile: async (req, res) => {
        const patientUsername = req.patientUsername

        const fileHash = req.query.fileHash;

        // get the file by its hash
        const file = await File.findOne({ fileHash });
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        if (patientUsername !== file.username) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        try{
            const bytes = await ipfsService.getFileFromIPFS(fileHash);
            const buffer = Buffer.from(bytes);
            res.status(200).send(buffer);
        }
        catch (e) {
            console.error('Error getting files:', e);
            res.status(500).json(e);
        }       
    },
    addAppointment: async (req, res) => {
        const { prescription, notes, chronics } = req.body;

        try {
            const doctor = await Doctor.findById(req.user)
            const blockchain_transaction_data = {
                "ChronicDiseases": chronics,
                "Date": new Date(),
                "DoctorId": req.doctorUsername,
                "Name": `${doctor.username}_${req.patientUsername}_${Date.now()}`,
                "Notes": notes,
                "PatientId": req.patientUsername,
                "Prescription": prescription,
            };
            const data = await hlf.CreateMedicalRecord(blockchain_transaction_data, req.patientUsername);
            res.send(data);
        }catch (error) {
            res.status(500).send({ error: 'Internal Server Error: couldn\'t add appointment' });
        }
    },
};

module.exports = remoteAccessController;