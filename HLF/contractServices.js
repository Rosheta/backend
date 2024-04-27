const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const networkUrl =  'https://65f4ccf914d31cebc0d4bc58.spydra.app/fabric/66155032510df7de2bdcec77/ledger/transact';
const apiKey =  'WaFCDYtQ8v2mQS6V62moN8nSWaVQzlBc8RTQ5WJ0';
const headers = {
    'accept': 'application/json',
    'X-API-KEY': apiKey
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
async function CreateMedicalRecord(id, patientName, dob, diagnosis, medications, allergies, doctor) {
    try {
        const response = await axios.post(networkUrl, {
            "functionName": "CreateMedicalRecord",
            "args": [id, patientName, dob, diagnosis, medications, allergies, doctor]
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// update a medical record in the blockchain service
async function UpdateMedicalRecord(id, patientName, dob, diagnosis, medications, allergies, doctor) {
    try {
        const response = await axios.post(networkUrl, {
            "functionName": "UpdateMedicalRecord",
            "args": [id, patientName, dob, diagnosis, medications, allergies, doctor]
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
    UpdateMedicalRecord
};
