const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

const patient = require('../models/patient');
const lab = require('../models/lab');
const doctor = require('../models/doctor');
const File = require('../models/file');

const ipfsService = require('../HLF/ipfsService');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const fileController = {
    upload : async (req, res) => {
        try {        
            console.log(req.file)
            const userId = req.user;
            const file = req.file;
            const ipfsData = await ipfsService.uploadFileToIPFS(file);
            console.log(ipfsData)
            let name = path.parse(req.file.originalname).name
            const newFile = new File({
                username: req.body.username, 
                hash: ipfsData.Hash,
                fileName: name,
                extension: path.extname(file.originalname)
            });
            console.log(newFile)
            await newFile.save();
          
            res.status(201).json({ message: 'Success' });
        } catch (e) {
            console.error('Error uploading file to IPFS and saving hash:', e);
            res.status(500).json(e);
        }
    },
    getUserFiles : async (req, res) => {
        try{
            const userId = req.user;
            const user = await patient.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const username = user.username;
            const userFiles = await File.find({ username });
    
            const filesList = userFiles.map(file => ({
                Filename: file.fileName,
                Extension: file.extension,
                Hash: file.hash,
                date: file.timestamp 
            }));
    
            res.status(200).json({ files: filesList });
        } catch (e) {
            console.error('Error getting files:', e);
            res.status(500).json(e);
        }
    },
    deleteFile : async (req, res) => {
        try {
            const userId = req.user;
            const hash = req.query.hash;

            const file = await File.findOne({ hash });

            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }

            const user = await patient.findById(userId);
            if (!user || user.username !== file.username) {
                return res.status(403).json({ error: 'Unauthorized' });
            }

            await File.deleteOne({ hash });

            res.status(200).json({ message: 'File deleted successfully' });
        } catch (e) {
            console.error('Error deleting file:', e);
            res.status(500).json(e);
        }
    },

    showFile : async (req,res) => {
        try{
            const userId = req.user;
            const hash = req.query.hash;
            const file = await File.findOne({ hash });

            if (!file) {
                return res.status(404).json({ error: 'File not found' });
            }

            const user = await patient.findById(userId);
            if (!user || user.username !== file.username) {
                return res.status(403).json({ error: 'Unauthorized' });
            }
            const bytes = await ipfsService.getFileFromIPFS(hash);
            res.status(200).json({ message: 'File sent successfully' });
        } catch (e) {
            console.error('Error showing file:', e);
            res.status(500).json(e);
        }

    }
};

module.exports = fileController;
