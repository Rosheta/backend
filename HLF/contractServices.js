const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

/** SPYDRA API :
const networkUrl =  'https://663148880e933e1efc2999ec.spydra.app/fabric/66314c0d510df7de2be05b28/ledger/transact';
const apiKey =  '1tz2jAPfLq47GxthTJ4E61RJRGAdwFy31URSmEzZ';
const headers = {
    'accept': 'application/json',
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json'
};
*/
const kaleidoPatUrl = 'https://e0jwan9vu1-e0jkm3wg5z-connect.de0-aws-ws.kaleido.io';
const kaleidoDocUrl = 'https://e0jwan9vu1-e0zkhqbo7r-connect.de0-aws-ws.kaleido.io'; 
const headers = {
    'accept': '*/*',
    'Authorization' :'Basic ZTBqcnhhMW0zeDpEdWVKOFRod3VCbUhEMV9wekFYYklhUmVGSFpHTEZxcG1GVnlJYUR2TV9F',
    'Content-Type': 'application/json'
};

CHAINCODE = "medo"
CHANNEL = "family"
// register a new patient in the blockchain service
async function RegisterPatient(patient) {
    try {
        const response = await axios.post(`${kaleidoPatUrl}/identities`, {
            "name":patient,
            "type" :"client"
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}
// register a new doctor in the blockchain service
async function RegisterDoctor(doctor) {
    try {
        const response = await axios.post(`${kaleidoDocUrl}/identities`, {
            "name":doctor,
            "type" :"client"
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}
// enroll a  patient in the blockchain service
async function EnrollPatient(patient,pass) {
    try {
        const response = await axios.post(`${kaleidoPatUrl}/identities/${patient}/enroll`, {
       "secret":pass
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}
// enroll a  doctor in the blockchain service
async function EnrollDoctor(doctor,pass) {
    try {
        const response = await axios.post(`${kaleidoDocUrl}/identities/${doctor}/enroll`, 
        {
            "secret":pass
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}
// get all patients from the blockchain service
async function getAllPatients() {
    try {
        const response = await axios.get(`${kaleidoPatUrl}/identities`,  { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}
// get all doctors from the blockchain service
async function getAllDoctors() {
    try {
        const response = await axios.get(`${kaleidoDocUrl}/identities`, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// get all medical records from the blockchain service
async function getAllMedicalRecords(signer) {
    try {
        const response = await axios.post(`${kaleidoPatUrl}/query`, {
            "headers":{ 
                "signer": signer,
                "channel": CHANNEL,
                "chaincode": CHAINCODE
            },
            "func": "GetAllMedicalRecords",
            "args": [],
            "strongread": true
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// get a medical record from the blockchain service
async function ReadMedicalRecord(recordId,signer) {
    try {
        const response = await axios.post(`${kaleidoPatUrl}/query`, {

            "headers":{
                "signer": signer,
                "channel": CHANNEL,
                "chaincode": CHAINCODE
            },
            "func": "ReadMedicalRecord",
            "args": [recordId]

        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// delete a medical record from the blockchain service
async function DeleteMedicalRecord(recordId,signer) {
    try {
        const response = await axios.post(`${kaleidoPatUrl}/transactions`, {        
            "headers":{
                "type": "SendTransaction",
                "signer": signer,
                "channel": CHANNEL,
                "chaincode": CHAINCODE
            },

            "func": "DeleteMedicalRecord",
            "args": [recordId]
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}


// add a medical record to the blockchain service
async function CreateMedicalRecord(appoiment,signer) {
      const {Name, PatientId, Date, Prescription, Notes, ChronicDiseases, DoctorId} = appoiment;
      console.log('CreateMedicalRecord', Name, PatientId, Date, Prescription, Notes, ChronicDiseases, DoctorId);

    try {
        const response = await axios.post(`${kaleidoPatUrl}/transactions`, {
            "headers":{
                "type": "SendTransaction",
                "signer": signer,
                "channel": CHANNEL,
                "chaincode": CHAINCODE

            },
            "func": "CreateMedicalRecord",
            "args": [Name, PatientId, Date, Prescription, Notes, ChronicDiseases, DoctorId],
            "init": false
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return error;
    }
}

// update a medical record in the blockchain service
async function UpdateMedicalRecord(appoiment,signer) {
    const {Name, PatientId, Date, Prescription, Notes, ChronicDiseases, DoctorId} = appoiment;

    try {
        const response = await axios.post(`${kaleidoPatUrl}/transactions`, {
            "headers":{
                "type": "SendTransaction",
                "signer": signer,
                "channel": CHANNEL,
                "chaincode": CHAINCODE
            },
            "func": "UpdateMedicalRecord",
            "args": [Name, PatientId, Date, Prescription, Notes, ChronicDiseases, DoctorId]
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// get all chronic dieases from the blockchain servic per patient
async function getChronicDieases(PatientId,signer) {
    try {
        const response = await axios.post(`${kaleidoPatUrl}/query`, {
            "headers":{
                "signer": signer,
                "channel": CHANNEL,
                "chaincode": CHAINCODE
            },
            "func": "GetAllChronicDiseasesForOnePatient",
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
    getChronicDieases,
    RegisterPatient,
    RegisterDoctor,
    EnrollPatient,
    EnrollDoctor,
    getAllPatients,
    getAllDoctors
    
};
