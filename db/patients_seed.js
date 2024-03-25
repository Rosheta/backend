const Patient = require('../models/patient');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
const { writeFile } = require('fs')
const db = require('./mongo')

dotenv.config();

async function main() {
    await Patient.deleteMany({});
    console.log('Database patients Cleared');

    const num_records = 10;

    for (let i = 0; i < num_records; i++) {
        const phone_number = faker.number.int({ min: 10000000000, max: 99999999999 }).toString();
        const ssn = faker.number.int({ min: 10000000000000, max: 99999999999999 }).toString();
        const email = faker.internet.email();
        const password = faker.internet.password();
        writeFile('./db/patients.txt', `${email} ---> ${password}\n`, {flag: 'a'}, (err) => {
            if (err)
                console.log(err);
            });
        await Patient.create({
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
            gender: faker.helpers.arrayElement(['m','f']),
            profile_picture: faker.image.avatar()
        });
    }
    console.log("patients seeded successfully")
    db.close()
}

main().catch(console.error);
