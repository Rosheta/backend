const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Lab = require('../models/lab');
const dotenv = require('dotenv');

dotenv.config();

const searchController = {
    search: async (req, res) => {
        const { query, government, specialization, organization } = req.body;
        console.log(query);
        console.log(government);
        console.log(specialization);
        console.log(organization);
        if(query === "") return res.status(200).json([]);

        let result = [];
        
        if (organization === 'Patient') {
            const filter = {};
            if (query) {
                filter.name = { $regex: query, $options: 'i' };
            }
            result = await Patient.find(filter).limit(20);
        } else if (organization === 'Lab') {
            const filter = {};
            if (query) {
                filter.name = { $regex: query, $options: 'i' };
            }
            if (government && government !== 'Any') {
                filter.government = { $regex: '^' + government, $options: 'i' };
            }
            result = await Lab.find(filter).limit(20);
        } else if (organization === 'Doctor') {
            const filter = {};
            if (query) {
                filter.name = { $regex: query, $options: 'i' };
            }
            if (government && government !== 'Any') {
                filter.government = { $regex: '^' + government, $options: 'i' };
            }
            if (specialization && specialization !== 'Any') {
                filter.department = { $regex: specialization, $options: 'i' };
            }
            result = await Doctor.find(filter).limit(20);
        } else if (organization === 'Any') {
            const patientFilter = {};
            const labFilter = {};
            const doctorFilter = {};

            if (query) {
                patientFilter.name = { $regex: query, $options: 'i' };
                labFilter.name = { $regex: query, $options: 'i' };
                doctorFilter.name = { $regex: query, $options: 'i' };
            }
            // if (government && government !== 'Any') {
            //     // patientFilter.government = { $regex: '^' + government, $options: 'i' };
            //     labFilter.government = { $regex: '^' + government, $options: 'i' };
            //     doctorFilter.government = { $regex: '^' + government, $options: 'i' };
            // }
            // if (specialization && specialization !== 'Any') {
            //     doctorFilter.department = { $regex: specialization, $options: 'i' };
            // }

            const patientResults = await Patient.find(patientFilter).limit(10);
            const labResults = await Lab.find(labFilter).limit(10);
            const doctorResults = await Doctor.find(doctorFilter).limit(10);

            // Merge and deduplicate results from all collections
            result = [...doctorResults, ...labResults, ...patientResults];
        }
        console.log(result);
        return res.status(200).json(result);
    }
};

module.exports = searchController;
