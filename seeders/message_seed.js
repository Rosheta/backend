const Message = require('../models/message');
const Chat = require('../models/chat');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');
const db = require('../db/mongo');

dotenv.config();

async function main() {
    await Message.deleteMany({});
    console.log('Database Messages Cleared');

    const num_records = process.env.MESSAGES_SEED_COUNT;

    for (let i = 0; i < num_records; i++) {
        try {
            const chat = await Chat.aggregate([{ $sample: { size: 1 } }]);
            console.log(i);
            const sender = Math.random() < 0.5 ? chat[0].userId_1 : chat[0].userId_2;
            const receiver = sender === chat[0].userId_1 ? chat[0].userId_2 : chat[0].userId_1;

            const newMessage = new Message({
                chatId: chat[0]._id,
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
