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
    getMedicalRecord: async (req, res) => {
      try {
        const id = req.query.id;
        const data = await hlf.ReadMedicalRecord(id);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    getAllCronicalDiseases: async (req, res) => {
      try {
        const PatientId = req.query.id;
        const data = await hlf.getChronicDieases(PatientId);
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
        
        
        const data = await hlf.CreateMedicalRecord(req.body);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    updateMedicalRecord: async (req, res) => {
      try {
        const data = await hlf.UpdateMedicalRecord(req.body);
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
    DeleteMedicalRecord: async (req, res) => {
      try {
        const id = req.query.id;
        const data = await hlf.DeleteMedicalRecord(id);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
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
