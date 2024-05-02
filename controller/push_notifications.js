const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');
const Firebase = require('../models/firebase');
var admin = require("firebase-admin");

dotenv.config();


var serviceAccount = require("../config/rosheta-b6472-firebase-adminsdk-gc2ya-d4795e4025.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


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

function generateToken(patientUsername,dcotorUsername){
    const payload = {
        patientUsername: patientUsername,
        dcotorUsername : dcotorUsername,
        uniqueId: uuid(), // Add a unique identifier to the payload
    };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_REMOTE_ACCESS_SECRET, { expiresIn:  JWT_REMOTE_ACCESS_EXPIRE});
    return token;
}

const pushNotificationsController = {
    giveAccess : async (req,res) => {
        const { username } = req.body;
        let doctorTokenDoc = await Firebase.find({username : username});
        if(!doctorTokenDoc) return res.status(400).json({msg : "This username doesn't exist"});
        let doctorToken = doctorTokenDoc.token;

        let userId = req.user;
        let user = await Patient.findById(userId);
        // console.log(user.username);
        // get the data of the patient who sends this request and send notification to the token of the doctor

        // when send notification to the doctor ,send token to access the data later
        try{
            let message = {
                notification : {
                    title: "You get access from user $address of user",
                    body: "test"
                },
                data:{ // here where to send the patient data 
                    dataAccessToken : generateToken(user.username,username),
                },
                token: doctorToken

            };
            admin.messaging().send(message).then((response) => {
                console.log("notification sent!",response);
                return res.status(200).json({msg : "Notification Sent"});
            })
            .catch((err) => {
                console.log("There is something wrong! ", err);
                return res.status(400).json({err});
            });
        }   
        catch(err){
            throw err;
        }
    }
};

module.exports = pushNotificationsController;