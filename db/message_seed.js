const Message = require('../models/message');
const Chat = require('../models/chat');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
const db = require('./mongo');

dotenv.config();

async function main() {
    await Message.deleteMany({});
    console.log('Database Messages Cleared');

    const num_records = process.env.MESSAGES_SEED_COUNT;

    for (let i = 0; i < num_records; i++) {
        try {
            const id = Math.floor(Math.random() * 100) + 1;
            const chat = await Chat.findOne({ 'chatId': id });
            
            const sender = Math.random() < 0.5 ? chat.userId_1 : chat.userId_2;
            const receiver = sender === chat.userId_1 ? chat.userId_2 : chat.userId_1;

            const newMessage = new Message({
                chatId: id,
                sender: sender,
                receiver: receiver,
                message: faker.lorem.sentence({ min: 3, max: 15 })
            });

            await newMessage.save();
        }
        catch (error) {
            console.log(error);
        }
    }
    console.log("Messages seeded successfully");
    db.close();
}

main().catch(console.error);
