const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Lab = require('../models/lab');
const dotenv = require('dotenv');

dotenv.config();

const searchController = {
    search: async (req, res) => {
        const { query, government, specialization, organization } = req.body;
        if(query === "") return res.status(200).json([]);

        console.log(query);
        let userId = req.user;
        let userType = req.type;
        // if the user is patient, don't search for patient
        if(userType === 'p'){
            let result = [];
        
            if (organization === 'Lab') {
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
                let user = await Patient.findById(userId);
                if(user.gender == 'f') result = await Doctor.find(filter).sort({ gender: 1 }).limit(20);
                else result = await Doctor.find(filter).limit(20);
            } else if (organization === 'Any') {
                const labFilter = {};
                const doctorFilter = {};

                if (query) {
                    labFilter.name = { $regex: query, $options: 'i' };
                    doctorFilter.name = { $regex: query, $options: 'i' };
                }

                const labResults = await Lab.find(labFilter).limit(10);
                let doctorResults = [];

                let user = await Patient.findById(userId);
                if(user.gender == 'f') doctorResults = await Doctor.find(doctorFilter).sort({ gender: 1 }).limit(10);
                else doctorResults = await Doctor.find(doctorFilter).limit(10);

                // Merge and deduplicate results from all collections
                result = [...doctorResults, ...labResults];
            }
            return res.status(200).json(result);

        }

        // else if the user is not patient , serarch for anything
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
