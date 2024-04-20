const Doctor = require('../models/doctor');
const dotenv = require('dotenv');

dotenv.config();

const searchController = {
    search: async (req, res) => {
        const query = req.body.query;
        const location = req.body.location;
        const specialization = req.body.specialization;
        console.log(query);
        console.log(location);
        console.log(specialization);
        const filter = {};

        // Construct the query condition based on the provided parameters
        if (query) {
            // Search by name approximately matching the query (case-insensitive)
            filter.name = { $regex: query, $options: 'i' };
        }

        if (location && location !== 'Any') {
            // Search by location if specified and not 'Any'
            filter.location = { $regex: '^' + location, $options: 'i' };
        }

        if (specialization && specialization !== 'Any') {
            // Search by specialization if specified and not 'Any'
            filter.department = { $regex: specialization, $options: 'i' };
        }

        // Perform the MongoDB query with the constructed filter
        const result = await Doctor.find(filter).limit(20);
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
