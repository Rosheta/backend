const express = require('express');
const router = express.Router();

const ipfsService = require('../HLF/ipfsService');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify the destination directory for file uploads

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file; // Now, req.file contains the uploaded file information
  console.log('file', file);
  const data = await ipfsService.uploadFileToIPFS(file);
  res.send(data);
});
// get a file from IPFS
router.get('/get', async (req, res) => {
  console.log('req.body', req);
  const hash = req.query.hash;
  const data = await ipfsService.getFileFromIPFS(hash);
  res.send(data);
});
router.get('/all', async (req, res) => {
  const data = await ipfsService.getAllFilesFromIPFS();
  res.send(data);
 
});
router.get('/delete', async (req, res) => {
  const hash = req.query.hash;
  const data = await ipfsService.deleteFileFromIPFS(hash);
  res.send(data);
});

module.exports = router;