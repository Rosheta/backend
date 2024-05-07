const hlf = require('../HLF/contractServices');
const ipfsService = require('../HLF/ipfsService');

const hlfController = {
  get: {
    getAllMedicalRecords: async (req, res) => {
      try {
        const signer = req.query.signer;

        const data = await hlf.getAllMedicalRecords(signer);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    getMedicalRecord: async (req, res) => {
      try {
        const id = req.query.id;
        const signer = req.query.signer;

        const data = await hlf.ReadMedicalRecord(id, signer);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    getAllCronicalDiseases: async (req, res) => {
      try {
        const PatientId = req.patientUsername;
        const signer = req.patientUsername;
        const data = await hlf.getChronicDieases(PatientId, signer);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    getAllAppointments: async (req, res) => {
      try {
        const PatientId = req.patientUsername;
        const signer = req.patientUsername;
        const data = await hlf.getAllAppointments(PatientId, signer);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' }); 
      } 
    }
    ,
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
    },
    getAllUsers: async (req, res) => {
      try {
        const data = await hlf.getAllUsers();
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    getAllData: async (req, res) => {
      try {
        const PatientId = req.query.id;
        const signer = req.query.signer;
        const appointments = await hlf.getAllAppointments(PatientId, signer);
        const chronicDiseases = await hlf.getChronicDieases(PatientId, signer);
        res.send({ "appointments":appointments, "chronicDiseases":chronicDiseases });
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  },
  post: {
    createMedicalRecord: async (req, res) => {
      try {
        
        const signer = req.query.signer;

        const data = await hlf.CreateMedicalRecord(req.body, signer);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    updateMedicalRecord: async (req, res) => {
      try {
        const signer = req.query.signer;
        const data = await hlf.UpdateMedicalRecord(req.body, signer);
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
    },
    // registerPatient
    RegisterUser: async (req, res) => {
      try {
        const data = await hlf.RegisterUser(req.body.name);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    // registerDoctor
    registerDoctor: async (req, res) => {
      try {
        const data = await hlf.RegisterDoctor(req.body.name);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    // enroll patient
    enrollPatient: async (req, res) => {
      try {
        const data = await hlf.EnrollPatient(req.body.name, req.body.pass);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    // enroll doctor
    enrollDoctor: async (req, res) => {
      try {
        const data = await hlf.EnrollDoctor(req.body.name, req.body.pass);
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
        const signer = req.query.signer;
        const data = await hlf.DeleteMedicalRecord(id, signer);
        res.send(data);
      } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    },
    DeleteAllMedicalRecords: async (req, res) => {
      try {
        const signer = req.query.signer;
        const data = await hlf.DeleteAllMedicalRecords(signer);
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
