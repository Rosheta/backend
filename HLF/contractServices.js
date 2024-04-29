const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();


const networkUrl =  'https://65f4cc0c14d31cebc0d4b9c0.spydra.app/fabric/6626af57510df7de2bdf41e5/ledger/transact';
const apiKey =  'bKtYcaTCWsXUHoGpsYl92GCD8zU4yWO9SQYcJ5H3';
const headers = {
    'accept': 'application/json',
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json'
};

// get all medical records from the blockchain service
async function getAllMedicalRecords() {
    try {
        const response = await axios.post(networkUrl, {
            "functionName": "GetAllMedicalRecords",
            "args": []
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// get a medical record from the blockchain service
async function ReadMedicalRecord(recordId) {
    try {
        const response = await axios.post(networkUrl, {
            "functionName": "ReadMedicalRecord",
            "args": [recordId]
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// delete a medical record from the blockchain service
async function DeleteMedicalRecord(recordId) {
    try {
        const response = await axios.post(networkUrl, {
            "functionName": "DeleteMedicalRecord",
            "args": [recordId]
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// add a medical record to the blockchain service
async function CreateMedicalRecord(appoiment) {
      const {Name, PatientId, Date, Prescription, Notes, ChronicDiseases, DoctorId} = appoiment;
      console.log('CreateMedicalRecord', Name, PatientId, Date, Prescription, Notes, ChronicDiseases, DoctorId);

    try {
        const response = await axios.post(networkUrl, {
            "functionName": "CreateMedicalRecord",
            "args": [Name, PatientId, Date, Prescription, Notes, ChronicDiseases, DoctorId]
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return error;
    }
}

// update a medical record in the blockchain service
async function UpdateMedicalRecord(appoiment) {
    const {Name, PatientId, Date, Prescription, Notes, ChronicDiseases, DoctorId} = appoiment;

    try {
        const response = await axios.post(networkUrl, {
            "functionName": "UpdateMedicalRecord",
            "args": [Name, PatientId, Date, Prescription, Notes, ChronicDiseases, DoctorId]
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// get all chronic dieases from the blockchain servic per patient
async function getChronicDieases(PatientId) {
    try {
        const response = await axios.post(networkUrl, {
            "functionName": "GetAllChronicDiseasesForOnePatient",
            "args": [PatientId]
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}
// export the functions
module.exports = {
    getAllMedicalRecords,
    ReadMedicalRecord,
    DeleteMedicalRecord,
    CreateMedicalRecord,
    UpdateMedicalRecord,
    getChronicDieases
};
