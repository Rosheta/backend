const Lab = require('../models/lab');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
const { writeFile, truncate } = require('fs')
const db = require('../db/mongo')
const {governments} = require('../utils/constants')

dotenv.config();

async function main() {
    await Lab.deleteMany({});
    console.log('Database labs Cleared');

    const num_records = process.env.LABS_SEED_COUNT;
    truncate("./seeders/labs.txt", 0, (err) => {
        if (err) {
            console.error("Error truncating file:", err);
        }
    });
    for (let i = 0; i < num_records; i++) {
        const phone_number = faker.number.int({ min: 10000000000, max: 99999999999 }).toString();
        const email = faker.internet.email();
        const password = faker.internet.password({length: 15, prefix: "Ul@1"});
        try {
            const lab = new Lab({
                name: faker.person.fullName(),
                phone_number: {
                    value: phone_number,
                    visible: true
                },
                email: {
                    value: email,
                    visible: true
                },
                password: password,
                profile_picture: faker.image.avatar(),
                location: "sedi beshr",
                government: faker.helpers.arrayElement(governments),
                license: "labs_licenses/momo-1713475764210.pdf"
            });
            await lab.save();
            writeFile('./seeders/labs.txt', `${lab._id} ---> ${email} ---> ${password}\n`, {flag: 'a'}, (err) => {
                if (err)
                    console.log(err);
            });
        }
        catch (error) {
            console.log(error)
        }
    }
    console.log("labs seeded successfully")
    db.close()
}

main().catch(console.error);
