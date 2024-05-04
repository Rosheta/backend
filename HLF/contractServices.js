const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();


const networkUrl =  'https://663148880e933e1efc2999ec.spydra.app/fabric/66314c0d510df7de2be05b28/ledger/transact';
const apiKey =  '1tz2jAPfLq47GxthTJ4E61RJRGAdwFy31URSmEzZ';
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
