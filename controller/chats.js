const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

const chat = require('../models/chat');
const patient = require('../models/patient');
const message = require('../models/message');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const chatController = {
    chats: async (req, res) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token is missing' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            const userId = decoded.id;
            console.log(userId)
            const userChats = await chat.find({
                $or: [
                    { userId_1: userId },
                    { userId_2: userId }
                ]
            });
            const chatIds = userChats.map(chat => chat.chatId);
            const friends = [];

            for (const chatId of chatIds) {
                const lastMessage = await message.findOne({ chatId }).sort({ timestamp: -1 });

                if (lastMessage) {
                    let friendId = '';
                    let friendName = '';
            
                    if (lastMessage.sender === userId) {
                        friendId = lastMessage.receiver;
                    } else {
                        friendId = lastMessage.sender;
                    }
            
                    const friend = await patient.findById(friendId);
                    if (friend) {
                        friendName = friend.name;
                    }
            
                    const formattedMessage = {
                        chatId: lastMessage.chatId,
                        name: friendName,
                        sender: lastMessage.sender,
                        lastmsg: lastMessage.message,
                        time: lastMessage.timestamp
                    };
                    friends.push(formattedMessage);
                }
            }
            return res.status(200).json({ friends });        
        } catch (error) {
            console.log(error)
            return res.status(401).json({ error: 'Token is invalid' });
        }
    },
    
    chatContent: async (req, res) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token is missing' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            const userId = decoded.id;

            const chatId = parseInt(req.body.chatId);
            console.log(chatId)
            const messages = await message.find({ chatId });

            if (!messages) {
                return res.status(404).json({ error: 'No messages found for the chatId' });
            }
    
            const formattedMessages = messages.map(message => ({
                sender: message.sender,
                message: message.message,
                time: message.timestamp,
                isSeen: message.isSeen
            }));
    
            return res.status(200).json({ userId, messages: formattedMessages });
        }catch (error) {
            console.log(error)
            return res.status(401).json({ error: 'Token is invalid' });
        }
    }
};

module.exports = chatController;