const chatController = require('../controller/chats.js');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Message = require('../models/message');
const Chat = require('../models/chat');
const Patient = require('../models/patient');

// Mock JWT_SECRET for testing purposes
process.env.JWT_SECRET = 'test-secret';

describe('chatController', () => {
  // Mock JWT verification
  jest.mock('jsonwebtoken', () => ({
    verify: jest.fn().mockReturnValue({ id: 'test-user-id' })
  }));

  // Mock MongoDB connection
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
  });

  // Clear database after each test
  afterEach(async () => {
    await Message.deleteMany({});
    await Chat.deleteMany({});
    await Patient.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('saveMessage', () => {
    it('should save a message to the database', async () => {
      // Arrange
      const senderId = 'senderId';
      const receiverId = 'receiverId';
      const chatId = new mongoose.Types.ObjectId();
      const message = 'Hello, world!';

      // Act
      const result = await chatController.saveMessage(senderId, receiverId, chatId, message);

      // Assert
      expect(result.success).toBe(true);

      // Check if message is saved in the database
      const savedMessage = await Message.findOne({ sender: senderId, receiver: receiverId, chatId: chatId, message: message });
      expect(savedMessage).toBeTruthy();
    });
  });

  describe('getReceiverId', () => {
    it('should return the receiver ID for a given chat ID and sender ID', async () => {
      // Arrange
      const senderId = '65fd9bcb0ed83e13f6a25d67';
      const receiverId = '65fd9bcb0ed83e13f6a25d32';
      const chatData = new Chat({ userId_1: senderId, userId_2: receiverId });
      await chatData.save();
      chatId = chatData._id.toString();

      // Act
      const result = await chatController.getReceiverId(chatId, senderId);

      // Assert
      expect(result).toEqual(receiverId);
    });

    it('should throw an error if chat is not found', async () => {
      // Arrange
      const chatId = new mongoose.Types.ObjectId();
      const senderId = '65fd9bcb0ed83e13f6a25d67';

      // Act & Assert
      await expect(chatController.getReceiverId(chatId, senderId)).rejects.toThrow('Chat not found');
    });
  });
});
