const dotenv = require('dotenv');
// const FCM = require('fcm-node');
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


// Initialize Firebase Admin SDK
// const serviceAccount = require('path/to/serviceAccountKey.json'); // Path to your Firebase service account key JSON file
// const certPath = admin.credential.cert(serviceAccount);
// const serverKey = "AAAAEjAVTVE:APA91bFUpaOW9NVZiylOffc2g8uj-ikP1WlTRcinhLplIH1cgQeWp_7wrdpKQ9hymnD6MSDi-IpXzFaY_pLqqiQRITOnVYrt1Qq1XvFbxYJ_YIqhoaDtc-i4u8BvRHpyvc5FRgICKhxE"
// var fcm = new FCM(serverKey);


const pushNotificationsController = {
     // generateToken: async (req, res) => {
    //     console.log(req.query.userId);
    //     // let user = await Patient.findById(req.query.userId);
    //     // console.log(user);

    //     const payload = {
    //     userId: req.userId,
    //     uniqueId: uuid(), // Add a unique identifier to the payload
    //     };
        
    //     console.log(JWT_REMOTE_ACCESS_SECRET);

    //     // Generate JWT token
    //     const token = jwt.sign(payload, JWT_REMOTE_ACCESS_SECRET, { expiresIn:  JWT_REMOTE_ACCESS_EXPIRE});

    //     res.status(200).json(token);
    // }


    giveAccess : async (req,res) => {
        let doctorToekn = await Firebase.find({username : req.body.username},{projection: {toekn:1}});

        let userId = req.user;
        let user = await Patient.findById(userId);
        // console.log(user.username);
        // get the data of the patient who sends this request and send notification to the token of the doctor

        // when send notification to the doctor ,send token to access the data later
        try{
            let message = {
                Notification : {
                    title: "You get access from user $address of user",
                    body: "test"
                },
                data:{ // here where to send the patient data 
                    orderId: "123456",
                    orderDate: "2024-4-30"
                },
                token: "doctorToekn"

            };
            admin.messaging().send(message).then((response) => {
                console.log("notification sent!",response);
                return res.status(200).json({msg : "Notification Sent"});
            })
            .catch((err) => {
                console.log("There is something wrong!");
                return res.status(400).json({err});
            });
        }   
        catch(err){
            throw err;
        }
    }
};

module.exports = pushNotificationsController;