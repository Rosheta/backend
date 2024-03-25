const Patient = require('../models/patient');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
const { writeFile, truncate } = require('fs')
const db = require('./mongo')

dotenv.config();

async function main() {
    await Patient.deleteMany({});
    console.log('Database patients Cleared');

    const num_records = process.env.PATIENTS_SEED_COUNT;
    truncate("./db/patients.txt", 0, (err) => {
        if (err) {
            console.error("Error truncating file:", err);
        }
    });
    for (let i = 0; i < num_records; i++) {
        const phone_number = faker.number.int({ min: 10000000000, max: 99999999999 }).toString();
        const ssn = faker.number.int({ min: 10000000000000, max: 99999999999999 }).toString();
        const email = faker.internet.email();
        const password = faker.internet.password();
        try {
            const patient = new Patient({
                name: faker.person.fullName(),
                phone_number: {
                    value: phone_number,
                    visible: true
                },
                ssn: {
                    value: ssn,
                    visible: true
                },
                email: {
                    value: email,
                    visible: true
                },
                password: password,
                d_o_b: {
                    value: faker.date.past(),
                    visible: true
                },
                gender: faker.helpers.arrayElement(['m', 'f']),
                profile_picture: faker.image.avatar()
            });
            writeFile('./db/patients.txt', `${patient._id} ---> ${email} ---> ${password}\n`, {flag: 'a'}, (err) => {
                if (err)
                    console.log(err);
            });
            await patient.save();
        }
        catch (error) {
            console.log(error)
        }
    }
    console.log("patients seeded successfully")
    db.close()
}

main().catch(console.error);
