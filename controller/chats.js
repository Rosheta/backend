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
                        chatId: lastMessage.chatId.toString(),
                        name: friendName,
                        sender: lastMessage.sender,
                        lastmsg: lastMessage.message,
                        time: lastMessage.timestamp,
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

            const chatId = parseInt(req.query.chatId);


            const Chat = await chat.findOne({ chatId });
            if (!Chat) {
                return res.status(404).json({ error: 'Chat not found' });
            }
           
            if (Chat.userId_1 !== userId && Chat.userId_2 !== userId) {
                return res.status(403).json({ error: 'Unauthorized access to chat' });
            }

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
    },

    startChat: async (req, res) => {
        try {         
            const currentUserId = req.user;
            const anotherUserId = req.body.userId;
    
            const existingChat = await chat.findOne({
                $or: [
                    { userId_1: currentUserId, userId_2: anotherUserId },
                    { userId_1: anotherUserId, userId_2: currentUserId }
                ]
            });
    
            if (existingChat) {
                return res.status(200).json({chatId: existingChat.chatId.toString() });
            }
    
            const newChat = new chat({
                userId_1: currentUserId,
                userId_2: anotherUserId
            });
    
            await newChat.save();
    
            return res.status(200).json({chatId: newChat.chatId.toString() });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },

    saveMessage: async (senderId, receiverId, chatId, msg) => {
        try {
            const newMessage = new message({
                chatId:chatId,
                sender: senderId,
                receiver: receiverId,
                message:msg
            });

            await newMessage.save();
            return { success: true };
        } catch (error) {
            console.log(error);
            return { success: false, error: 'Failed to save message' };
        }
    },

    getReceiverId : async (chatId, senderId) => {
        try {
            const chatData = await chat.findOne({ chatId });
            if (!chatData) {
                throw new Error('Chat not found');
            }
            const receiverId = senderId === chatData.userId_1 ? chatData.userId_2 : chatData.userId_1;
            return receiverId;
        } catch (error) {
            console.log(error)
            throw new Error(`Failed to get receiver ID: ${error.message}`);
        }
 
    }
};
module.exports = chatController;