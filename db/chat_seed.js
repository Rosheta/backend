const Chat = require('../models/chat');
const Counter = require('../models/counter');
const dotenv = require('dotenv');
const { readFileSync } = require('fs')
const db = require('./mongo')

dotenv.config();

async function main() {
    await Counter.deleteMany({});
    await Chat.deleteMany({});
    console.log('Database Chats Cleared');

    const num_records = process.env.CHATS_SEED_COUNT;

    const data = readFileSync("./db/patients.txt", 'utf8');
    const lines = data.split('\n');
    let ids = lines.map(line => {
        const parts = line.split(' ---> ');
        return parts[0];
    });

    for (let i = 0; i < num_records; i++) {
        try {
            const index1 = Math.floor(Math.random() * ids.length);
            const userId_1 = ids[index1];
            ids.splice(index1, 1);

            const index2 = Math.floor(Math.random() * ids.length);
            const userId_2 = ids[index2];
            ids.splice(index2, 1);

            const newChat = new Chat({
                userId_1: userId_1,
                userId_2: userId_2
            });
    
            // Save the new chat document
            await newChat.save();
        } catch (error) {
            console.log(error)
        }
    }
    console.log("chats seeded successfully")
    db.close()
}

main().catch(console.error);