const jwt = require('jsonwebtoken');

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

function generateToken(patientUsername,doctorUsername){
    const payload = {
        patientUsername: patientUsername,
        doctorUsername : doctorUsername,
        uniqueId: uuid(), // Add a unique identifier to the payload
    };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_REMOTE_ACCESS_SECRET, { expiresIn:  JWT_REMOTE_ACCESS_EXPIRE});
    return token;
}

module.exports = {generateToken};