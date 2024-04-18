const hlf = require('../HLF/contractServices');
const ipfsService = require('../HLF/ipfsService');

const hlfController = {
  get: {
    getAllMedicalRecords: async (req, res) => {
      try {
        const data = await hlf.getAllMedicalRecords();
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    getFileFromIPFS: async (req, res) => {
      try {
        const hash = req.query.hash;
        const data = await ipfsService.getFileFromIPFS(hash);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    getAllFilesFromIPFS: async (req, res) => {
      try {
        const data = await ipfsService.getAllFilesFromIPFS();
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  },
  post: {
    createMedicalRecord: async (req, res) => {
      try {
        const { id, patientName, dob, diagnosis, medications, allergies, doctor } = req.body;
        const data = await hlf.CreateMedicalRecord(id, patientName, dob, diagnosis, medications, allergies, doctor);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    uploadFileToIPFS: async (req, res) => {
      try {
        const file = req.file;
        const data = await ipfsService.uploadFileToIPFS(file);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  },
  delete: {
    deleteFileFromIPFS: async (req, res) => {
      try {
        const hash = req.query.hash;
        const data = await ipfsService.deleteFileFromIPFS(hash);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  }
};

module.exports = {hlfController, get: hlfController.get, post: hlfController.post, delete: hlfController.delete };
