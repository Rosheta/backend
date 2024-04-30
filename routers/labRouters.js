const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const fileController = require('../controller/file');

const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'labs_licenses/')
  },
    filename: function (req, file, cb) {
        console.log(req.file)
        const name = req.body.name.replace(/\s+/g, '_');
        const filename = name + '-' + Date.now() + path.extname(file.originalname)
        cb(null, filename)
  }
})

const upload = multer({ storage: storage })
const upload_lab_documents = multer()

// Route for registering a new lab
router.post('/register', upload.single('file'), authController.register_lab);

router.post('/upload', upload_lab_documents.single('file'), fileController.upload);

module.exports = router;
