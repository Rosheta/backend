const Doctor = require('../models/doctor');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
const { writeFile, truncate } = require('fs')
const db = require('../db/mongo')

dotenv.config();

async function main() {
    await Doctor.deleteMany({});
    console.log('Database doctors Cleared');

    const num_records = process.env.DOCTORS_SEED_COUNT;
    truncate("./seeders/doctors.txt", 0, (err) => {
        if (err) {
            console.error("Error truncating file:", err);
        }
    });
    for (let i = 0; i < num_records; i++) {
        const phone_number = faker.number.int({ min: 10000000000, max: 99999999999 }).toString();
        const ssn = faker.number.int({ min: 10000000000000, max: 99999999999999 }).toString();
        const email = faker.internet.email();
        const password = faker.internet.password({length: 15, prefix: "Ul@1"});
        try {
            const doctor = new Doctor({
                name: faker.person.fullName(),
                phone_number: {
                    value: phone_number,
                    visible: true
                },
                ssn: ssn,
                email: {
                    value: email,
                    visible: true
                },
                password: password,
                birthdate: {
                    value: faker.date.past(),
                    visible: true
                },
                gender: faker.helpers.arrayElement(['m', 'f']),
                profile_picture: faker.image.avatar(),
                location: "sedi beshr",
                government: faker.helpers.arrayElement(["Alexandria", "Cairo"]),
                department: faker.helpers.arrayElement(["Neurology", "Otology"]),
                license: "enta zay el fol",
            });
            await doctor.save();
            const line = `${doctor._id} ---> ${email} ---> ${password}`;
            writeFile('./seeders/doctors.txt', i<num_records-1 ? `${line}\n` : line, { flag: 'a' }, (err) => {
                if (err)
                    console.log(err);
            });
        }
        catch (error) {
            console.log(error)
        }
    }
    console.log("doctors seeded successfully")
    db.close()
}

main().catch(console.error);
