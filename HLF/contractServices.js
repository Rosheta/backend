const axios = require('axios');
const dotenv = require('dotenv');
const { json } = require('express');
dotenv.config();

const kaleidoPatUrl = process.env.kaleidoPatUrl;
const kaleidoDocUrl = process.env.kaleidoDocUrl; 
const headers = {
    'accept': '*/*',
    'Authorization': process.env.kaleidoKEY,
        'Content-Type': '*/*'
};

CHAINCODE = "medo"
CHANNEL = "family"
// register a new patient in the blockchain service
async function RegisterUser(user) {
    try {
        const response = await axios.post(`${kaleidoPatUrl}/identities`, {
            "name":user,
            "type" :"client"
        }, { headers });
        return response.data;
    } catch (error) {

        console.error('Error:', error);
        return error ;
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
        return error ;

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
        return error ;

    }
}
// get all patients from the blockchain service
async function getAllUsers() {
    try {
        const response = await axios.get(`${kaleidoPatUrl}/identities`,  { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return error ;

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
        return response.data.result;
    } catch (error) {
        console.error('Error:', error);
        return error ;

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
        return response.data.result;
    } catch (error) {
        console.error('Error:', error);
        return error ;

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
        return error ;

    }
}


// add a medical record to the blockchain service
async function CreateMedicalRecord(appoiment,signer) {
      console.log('CreateMedicalRecord', appoiment);

    try {
        const response = await axios.post(`${kaleidoPatUrl}/transactions`, {
            "headers":{
                "type": "SendTransaction",
                "signer": signer,
                "channel": CHANNEL,
                "chaincode": CHAINCODE

            },
            "func": "CreateMedicalRecord",
            "args": [JSON.stringify(appoiment)],
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
    console.log('UpdateMedicalRecord', appoiment);
    
 const { Name,  PatientId,  Date,  Prescription,  Notes,  ChronicDiseases,  DoctorId} = appoiment;

    try {
        const response = await axios.post(`${kaleidoPatUrl}/transactions`, {
            "headers":{
                "type": "SendTransaction",
                "signer": signer,
                "channel": CHANNEL,
                "chaincode": CHAINCODE
            },
            "func": "UpdateMedicalRecord",
            "args": [Name,  PatientId,  Date,  Prescription,  Notes,  JSON.stringify(ChronicDiseases),  DoctorId]
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return error ;

    }
}
// get all appointments from the blockchain service for patient
async function getAllAppointments(PatientId,signer) {
    try {
        const response = await axios.post(`${kaleidoPatUrl}/query`, {
            "headers":{
                "signer": signer,
                "channel": CHANNEL,
                "chaincode": CHAINCODE
            },
            "func": "GetAllMedicalRecordsForOnePatient",
            "args": [PatientId]
        }, { headers });
        return response.data.result;
    } catch (error) {
        console.error('Error:', error);
        return error ;

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
        return response.data.result;
    } catch (error) {
        console.error('Error:', error);
        return error ;

    }
}
// delete all medical records from the blockchain service
async function DeleteAllMedicalRecords(signer) {
    try {
        const response = await axios.post(`${kaleidoPatUrl}/transactions`, {
            "headers":{
                "type": "SendTransaction",
                "signer": signer,
                "channel": CHANNEL,
                "chaincode": CHAINCODE
            },
            "func": "DeleteAllMedicalRecords",
            "args": []
        }, { headers });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return error ;

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
    RegisterUser,
    EnrollPatient,
    EnrollDoctor,
    getAllUsers,
    getAllAppointments,
    DeleteAllMedicalRecords
    
    
};
