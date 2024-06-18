const dotenv = require('dotenv');
const Patient = require('../models/patient');
const Firebase = require('../models/firebase');
var admin = require("firebase-admin");
const {generateToken} = require('../general/utils');

dotenv.config();


var serviceAccount = require("../config/rosheta-b6472-firebase-adminsdk-gc2ya-d4795e4025.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const pushNotificationsController = {
    giveAccess : async (req,res) => {
        const { username } = req.body;

        // check for the input username if it is already exist
        let doctorTokenDoc = await Firebase.findOne({username : username});
        if(!doctorTokenDoc) return res.status(400).json({msg : "This username doesn't exist"});
        let doctorToken = doctorTokenDoc.token;

        let userId = req.user;
        let user = await Patient.findById(userId);
        const patientUsername = user.username;

        // when send notification to the doctor ,send token to access the data later
        try{
            let message = {
                notification : {
                    title: `You get access from user ${patientUsername}`,
                    body: ""
                },
                data:{ // here where to send the patient data 
                    dataAccessToken : generateToken(patientUsername,username),
                },
                token: doctorToken

            };
            console.log(message);
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