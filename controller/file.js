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
            const newFile = new File({
                username: req.body.username, 
                hash: ipfsData.Hash,
                fileName: req.file.originalname,
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
            const username = await Patient.getUsernameById(userId);
            const userFiles = await File.find({ username });
    
            const filesList = userFiles.map(file => ({
                Filename: file.name,
                Extension: file.extension,
                Hash: file.hash,
                date: file.timestamp // Assuming timestamp field contains the upload date
            }));
    
            res.status(200).json({ files: filesList });
        } catch (error) {
            console.error('Error getting files:', error);
            res.status(500).json(e);
        }
    }
};

module.exports = fileController;
