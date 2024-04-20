const Chat = require('../models/chat');
const dotenv = require('dotenv');
const { readFileSync } = require('fs')
const db = require('../db/mongo')

dotenv.config();

async function main() {
    await Chat.deleteMany({});
    console.log('Database Chats Cleared');

    const num_records = parseInt(process.env.CHATS_SEED_COUNT); // Parsing to integer

    let data = readFileSync("./seeders/patients.txt", 'utf8');
    let lines = data.split('\n');
    let patients_ids = lines.map(line => {
        const parts = line.split(' ---> ');
        return parts[0];
    });

    data = readFileSync("./seeders/doctors.txt", 'utf8');
    lines = data.split('\n');
    let doctors_ids = lines.map(line => {
        const parts = line.split(' ---> ');
        return parts[0];
    });
    
    let pairs = new Set();

    while (pairs.size <= num_records) { // Loop until desired number of records is achieved
        try {
            let index1 = Math.floor(Math.random() * patients_ids.length);
            let index2 = Math.floor(Math.random() * doctors_ids.length);   
            
            const pair = [index1, index2]; // Creating pair as an array
            
            if (!pairs.has(pair)) {
                pairs.add(pair);

                const userId_1 = patients_ids[index1];

                const userId_2 = doctors_ids[index2];
                console.log(userId_1);
                console.log(userId_2);

                const newChat = new Chat({
                    userId_1: userId_1,
                    userId_2: userId_2
                });
        
                // Save the new chat document
                await newChat.save();
            }
        } catch (error) {
            console.log(error)
        }
    }
    console.log("chats seeded successfully")
    db.close()
}

main().catch(console.error);
