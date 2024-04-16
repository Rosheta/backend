const Doctor = require('../models/doctor');
const dotenv = require('dotenv');

dotenv.config();

const searchController = {
    search: async (req, res) => {

        const query = req.body.query;
        const hospital = req.body.hospitalName;
        const specialization = req.body.specialization;
        console.log(query);
        console.log(hospital);
        console.log(specialization);
        // const result = await Doctor.find({ username: { $regex: '^' + query, $options: 'i' } },{projection: {username:1}}).toArray();
        const result = await Doctor.find({ name:query });
        console.log(result);
        

        if(query == ""){
            return res.status(200).json([]);
        } 
        else {
            return res.status(200).json(result);
        }
    }
};

module.exports = searchController;
