// test contractService.js
const axios = require('axios');
const { RegisterUser, EnrollPatient, EnrollDoctor, getAllUsers } = require('../../HLF/contractServices');

// Mock the environment variables
kaleidoPatUrl = process.env.kaleidoPatUrl;
kaleidoDocUrl = process.env.kaleidoDocUrl;
headers = {
    'accept': '*/*',
    'Authorization': process.env.kaleidoKEY,
    'Content-Type': '*/*'
};

describe('register users', () => {
    // Successfully register a new patient with a valid user name
    it('should successfully register a new patient with a valid user name', async () => {
        // Mock the axios.post function
        const axiosMock = jest.spyOn(axios, 'post');
        axiosMock.mockResolvedValueOnce({ data: 'success' });
  
        // Call the RegisterUser function
        const result = await RegisterUser('JohnDoe');
  
        // Check if the axios.post function was called with the correct arguments
        expect(axiosMock).toHaveBeenCalledWith(`${kaleidoPatUrl}/identities`, {
          "name": "JohnDoe",
          "type": "client"
        }, { headers });
  
        // Check if the result is the expected value
        expect(result).toEqual('success');
  
        // Restore the original axios.post function
        axiosMock.mockRestore();
      });
          // Attempt to register a patient with an empty user name
    it('should return an error when attempting to register a patient with an empty user name', async () => {
        // Mock the axios.post function
        const axiosMock = jest.spyOn(axios, 'post');
        axiosMock.mockRejectedValueOnce('error');
  
        // Call the RegisterUser function
        const result = await RegisterUser('');
  
        // Check if the axios.post function was called with the correct arguments
        expect(axiosMock).toHaveBeenCalledWith(`${kaleidoPatUrl}/identities`, {
          "name": "",
          "type": "client"
        }, { headers });
  
        // Check if the result is the expected error
        expect(result).toEqual('error');
  
        // Restore the original axios.post function
        axiosMock.mockRestore();
      });
          // Enroll a patient with valid patient ID and password
    it('should enroll a patient with valid patient ID and password', async () => {
        // Mock the axios.post function
        const axiosMock = jest.spyOn(axios, 'post');
        axiosMock.mockResolvedValue({ data: 'Enrollment successful' });
  
        // Call the EnrollPatient function
        const result = await EnrollPatient('patient123', 'password123');
  
        // Check that the axios.post function was called with the correct arguments
        expect(axiosMock).toHaveBeenCalledWith(`${kaleidoPatUrl}/identities/patient123/enroll`, {
          "secret": "password123"
        }, { headers });
  
        // Check that the result is the expected value
        expect(result).toBe('Enrollment successful');
  
        // Restore the axios.post function
        axiosMock.mockRestore();
      });
          // Enroll a patient with empty patient ID
    it('should not enroll a patient with empty patient ID', async () => {
        // Mock the axios.post function
        const axiosMock = jest.spyOn(axios, 'post');
        axiosMock.mockRejectedValue(new Error('Invalid patient ID'));
  
        // Call the EnrollPatient function
        const result = await EnrollPatient('', 'password123');
  
        // Check that the axios.post function was not called
        expect(axiosMock).not.toHaveBeenCalled();
  
        // Check that the result is the expected error
        expect(result).toEqual(new Error('Invalid patient ID'));
  
        // Restore the axios.post function
        axiosMock.mockRestore();
      });
        
    });
describe('EnrollUser', () => {
    it('should enroll a doctor with valid credentials', async () => {
        const axios = require('axios');
        const contractServices = require('../backend/HLF/contractServices.js');

        // Mock the axios post method
        axios.post = jest.fn().mockResolvedValue({ data: 'Enrollment successful' });

        // Call the EnrollDoctor function
        const result = await contractServices.EnrollDoctor('doctor1', 'password123');

        // Check if the axios post method was called with the correct arguments
        expect(axios.post).toHaveBeenCalledWith(`${contractServices.kaleidoDocUrl}/identities/doctor1/enroll`, {
            "secret": "password123"
        }, { headers: contractServices.headers });

        // Check if the result is as expected
        expect(result).toBe('Enrollment successful');
    });
        // Enroll a doctor with empty username
        it('should not enroll a doctor with empty username', async () => {
            const axios = require('axios');
            const contractServices = require('../backend/HLF/contractServices.js');
    
            // Call the EnrollDoctor function with an empty username
            const result = await contractServices.EnrollDoctor('', 'password123');
    
            // Check if the axios post method was not called
            expect(axios.post).not.toHaveBeenCalled();
    
            // Check if the result is an error
            expect(result).toBeInstanceOf(Error);
        });
            // Enroll a doctor with invalid kaleidoDocUrl
    it('should return an error when enrolling a doctor with invalid kaleidoDocUrl', async () => {
        const axios = require('axios');
        const contractServices = require('../backend/HLF/contractServices.js');

        // Mock the axios post method
        axios.post = jest.fn().mockRejectedValue('Invalid kaleidoDocUrl');

        // Call the EnrollDoctor function
        const result = await contractServices.EnrollDoctor('doctor1', 'password123');

        // Check if the axios post method was called with the correct arguments
        expect(axios.post).toHaveBeenCalledWith(`${contractServices.kaleidoDocUrl}/identities/doctor1/enroll`, {
            "secret": "password123"
        }, { headers: contractServices.headers });

        // Check if the result is an error
        expect(result).toBeInstanceOf(Error);
    });
});
describe('getAllUsers', () => {
        // Successfully retrieves all patients from the blockchain service
        it('should successfully retrieve all patients from the blockchain service', async () => {
            // Mock axios.get() to return a successful response
            axios.get = jest.fn().mockResolvedValue({ data: 'patients' });
    
            // Call the function under test
            const result = await getAllUsers();
    
            // Verify the result
            expect(result).toEqual('patients');
            expect(axios.get).toHaveBeenCalledWith(`${kaleidoPatUrl}/identities`, { headers });
        });
            // Handles error response gracefully
    it('should handle error response gracefully', async () => {
        // Mock axios.get() to throw an error
        axios.get = jest.fn().mockRejectedValue('error');

        // Call the function under test
        const result = await getAllUsers();

        // Verify the result
        expect(result).toEqual('error');
        expect(axios.get).toHaveBeenCalledWith(`${kaleidoPatUrl}/identities`, { headers });
    });
        // Handles empty response gracefully
        it('should handle empty response gracefully', async () => {
            // Mock axios.get() to return an empty response
            axios.get = jest.fn().mockResolvedValue({ data: '' });
      
            // Call the function under test
            const result = await getAllUsers();
      
            // Verify the result
            expect(result).toEqual('');
            expect(axios.get).toHaveBeenCalledWith(`${kaleidoPatUrl}/identities`, { headers });
          });
              
          // Handles network error gracefully
    it('should handle network error gracefully when retrieving all patients from the blockchain service', async () => {
        // Mock axios.get() to throw an error
        axios.get = jest.fn().mockRejectedValue(new Error('Network Error'));
  
        // Call the function under test
        const result = await getAllUsers();
  
        // Verify the result
        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('Network Error');
        expect(axios.get).toHaveBeenCalledWith(`${kaleidoPatUrl}/identities`, { headers });
      });
          // Handles unexpected response format gracefully
    it('should handle unexpected response format gracefully when axios.get() returns an unexpected response format', async () => {
        // Mock axios.get() to return an unexpected response format
        axios.get = jest.fn().mockResolvedValue({ data: null });

        // Call the function under test
        const result = await getAllUsers();

        // Verify the result
        expect(result).toEqual(null);
        expect(console.error).toHaveBeenCalledWith('Error:', null);
    });
});


describe('CreateMedicalRecord', () => {

    // Successfully adds a medical record to the blockchain service
    it('should add a medical record to the blockchain service successfully', async () => {
        // Mock axios.post to return a successful response
        axios.post = jest.fn().mockResolvedValue({ data: 'success' });

        // Mock process.env.kaleidoPatUrl
        process.env.kaleidoPatUrl = 'mocked-url';

        // Call the function
        const result = await CreateMedicalRecord({ appointment: 'mocked-appointment' }, 'mocked-signer');

        // Check if axios.post is called with the correct arguments
        expect(axios.post).toHaveBeenCalledWith('mocked-url/transactions', {
            "headers": {
                "type": "SendTransaction",
                "signer": 'mocked-signer',
                "channel": 'family',
                "chaincode": 'medo'
            },
            "func": "CreateMedicalRecord",
            "args": ['{"appointment":"mocked-appointment"}'],
            "init": false
        }, { headers });

        // Check if the result is as expected
        expect(result).toBe('success');
    });

    // Throws an error if unable to add medical record to the blockchain service
    it('should throw an error when unable to add medical record to the blockchain service', async () => {
        // Mock axios.post to throw an error
        axios.post = jest.fn().mockRejectedValue(new Error('mocked-error'));

        // Mock process.env.kaleidoPatUrl
        process.env.kaleidoPatUrl = 'mocked-url';

        // Call the function
        const result = await CreateMedicalRecord({ appointment: 'mocked-appointment' }, 'mocked-signer');

        // Check if axios.post is called with the correct arguments
        expect(axios.post).toHaveBeenCalledWith('mocked-url/transactions', {
            "headers": {
                "type": "SendTransaction",
                "signer": 'mocked-signer',
                "channel": 'family',
                "chaincode": 'medo'
            },
            "func": "CreateMedicalRecord",
            "args": ['{"appointment":"mocked-appointment"}'],
            "init": false
        }, { headers });

        // Check if the result is an error
        expect(result).toBeInstanceOf(Error);
    });

    // Returns the response data
    it('should add a medical record to the blockchain service successfully', async () => {
        // Mock axios.post to return a successful response
        axios.post = jest.fn().mockResolvedValue({ data: 'success' });

        // Mock process.env.kaleidoPatUrl
        process.env.kaleidoPatUrl = 'mocked-url';

        // Call the function
        const result = await CreateMedicalRecord({ appointment: 'mocked-appointment' }, 'mocked-signer');

        // Check if axios.post is called with the correct arguments
        expect(axios.post).toHaveBeenCalledWith('mocked-url/transactions', {
            "headers": {
                "type": "SendTransaction",
                "signer": 'mocked-signer',
                "channel": 'family',
                "chaincode": 'medo'
            },
            "func": "CreateMedicalRecord",
            "args": ['{"appointment":"mocked-appointment"}'],
            "init": false
        }, { headers });

        // Check if the result is as expected
        expect(result).toBe('success');
    });

    // Handles valid input data
    it('should add a medical record to the blockchain service successfully', async () => {
        // Mock axios.post to return a successful response
        axios.post = jest.fn().mockResolvedValue({ data: 'success' });

        // Mock process.env.kaleidoPatUrl
        process.env.kaleidoPatUrl = 'mocked-url';

        // Call the function
        const result = await CreateMedicalRecord({ appointment: 'mocked-appointment' }, 'mocked-signer');

        // Check if axios.post is called with the correct arguments
        expect(axios.post).toHaveBeenCalledWith('mocked-url/transactions', {
            "headers": {
                "type": "SendTransaction",
                "signer": 'mocked-signer',
                "channel": 'family',
                "chaincode": 'medo'
            },
            "func": "CreateMedicalRecord",
            "args": ['{"appointment":"mocked-appointment"}'],
            "init": false
        }, { headers });

        // Check if the result is as expected
        expect(result).toBe('success');
    });

    // Handles empty input data
    it('should return an error when the input data is empty', async () => {
        // Call the function with empty input data
        const result = await CreateMedicalRecord({}, 'mocked-signer');

        // Check if axios.post is not called
        expect(axios.post).not.toHaveBeenCalled();

        // Check if the result is an error
        expect(result).toBeInstanceOf(Error);
    });

    // Handles input data with extra fields
    it('should add a medical record to the blockchain service successfully when input data has extra fields', async () => {
        // Mock axios.post to return a successful response
        axios.post = jest.fn().mockResolvedValue({ data: 'success' });

        // Mock process.env.kaleidoPatUrl
        process.env.kaleidoPatUrl = 'mocked-url';

        // Call the function
        /**
         * Represents the result of creating a medical record.
         * @typedef {Object} CreateMedicalRecordResult
         * @property {string} appointment - The appointment value used for creating the medical record.
         * @property {string} extraField - The extra field value used for creating the medical record.
         * @property {string} signer - The signer value used for creating the medical record.
         */
        /**
         * Represents the result of creating a medical record.
         * @typedef {Object} CreateMedicalRecordResult
         * @property {string} appointment - The appointment value used for creating the medical record.
         * @property {string} extraField - The extra field value used for creating the medical record.
         * @property {string} mockedSigner - The mocked signer value used for creating the medical record.
         */
        const result = await CreateMedicalRecord({ appointment: 'mocked-appointment', extraField: 'extra-value' }, 'mocked-signer');

        // Check if axios.post is called with the correct arguments
        expect(axios.post).toHaveBeenCalledWith('mocked-url/transactions', {
            "headers": {
                "type": "SendTransaction",
                "signer": 'mocked-signer',
                "channel": 'family',
                "chaincode": 'medo'
            },
            "func": "CreateMedicalRecord",
            "args": ['{"appointment":"mocked-appointment","extraField":"extra-value"}'],
            "init": false
        }, { headers });

        // Check if the result is as expected
        expect(result).toBe('success');
    });

    // Handles invalid input data format
    it('should handle invalid input data format when creating a medical record', async () => {
      // Mock axios.post to return an error response
      axios.post = jest.fn().mockRejectedValue({ error: 'Invalid input data format' });

      // Mock process.env.kaleidoPatUrl
      process.env.kaleidoPatUrl = 'mocked-url';

      // Call the function with invalid input data format
      const result = await CreateMedicalRecord('invalid-data', 'mocked-signer');

      // Check if axios.post is called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith('mocked-url/transactions', {
          "headers": {
              "type": "SendTransaction",
              "signer": 'mocked-signer',
              "channel": 'family',
              "chaincode": 'medo'
          },
          "func": "CreateMedicalRecord",
          "args": ['"invalid-data"'],
          "init": false
      }, { headers });

      // Check if the result is an error
      expect(result).toEqual({ error: 'Invalid input data format' });
    });

    // Handles invalid input data structure
    it('should handle invalid input data structure when creating a medical record', async () => {
      // Mock axios.post to return an error response
      axios.post = jest.fn().mockRejectedValue({ error: 'Invalid input data structure' });

      // Mock process.env.kaleidoPatUrl
      process.env.kaleidoPatUrl = 'mocked-url';

      // Call the function with invalid input data structure
      const result = await CreateMedicalRecord('invalid-data', 'mocked-signer');

      // Check if axios.post is called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith('mocked-url/transactions', {
          "headers": {
              "type": "SendTransaction",
              "signer": 'mocked-signer',
              "channel": 'family',
              "chaincode": 'medo'
          },
          "func": "CreateMedicalRecord",
          "args": ['"invalid-data"'],
          "init": false
      }, { headers });

      // Check if the result is an error
      expect(result).toEqual({ error: 'Invalid input data structure' });
    });

    // Handles invalid input data length
    it('should handle invalid input data length when creating a medical record', async () => {
      // Mock axios.post to return an error response
      axios.post = jest.fn().mockRejectedValue({ error: 'Invalid input data length' });

      // Mock process.env.kaleidoPatUrl
      process.env.kaleidoPatUrl = 'mocked-url';

      // Call the function with invalid input data length
      const result = await CreateMedicalRecord({ appointment: 'mocked-appointment' }, 'mocked-signer');

      // Check if axios.post is called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith('mocked-url/transactions', {
          "headers": {
              "type": "SendTransaction",
              "signer": 'mocked-signer',
              "channel": 'family',
              "chaincode": 'medo'
          },
          "func": "CreateMedicalRecord",
          "args": ['{"appointment":"mocked-appointment"}'],
          "init": false
      }, { headers });

      // Check if the result is an error
      expect(result).toEqual({ error: 'Invalid input data length' });
    });
});

describe('DeleteMedicalRecord', () => {

    // Successfully delete a medical record with valid recordId and signer
    it('should successfully delete a medical record with valid recordId and signer', async () => {
      // Mock axios.post to return a successful response
      axios.post = jest.fn().mockResolvedValue({ data: 'Record deleted' });

      // Call the DeleteMedicalRecord function with valid recordId and signer
      const result = await DeleteMedicalRecord('validRecordId', 'validSigner');

      // Verify that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/transactions`, {
        "headers": {
          "type": "SendTransaction",
          "signer": 'validSigner',
          "channel": CHANNEL,
          "chaincode": CHAINCODE
        },
        "func": "DeleteMedicalRecord",
        "args": ['validRecordId']
      }, { headers });

      // Verify that the result is the expected response
      expect(result).toBe('Record deleted');
    });

    // Attempt to delete a medical record with an invalid recordId
    it('should return an error when attempting to delete a medical record with an invalid recordId', async () => {
      // Mock axios.post to throw an error
      axios.post = jest.fn().mockRejectedValue(new Error('Invalid recordId'));

      // Call the DeleteMedicalRecord function with an invalid recordId
      const result = await DeleteMedicalRecord('invalidRecordId', 'validSigner');

      // Verify that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/transactions`, {
        "headers": {
          "type": "SendTransaction",
          "signer": 'validSigner',
          "channel": CHANNEL,
          "chaincode": CHAINCODE
        },
        "func": "DeleteMedicalRecord",
        "args": ['invalidRecordId']
      }, { headers });

      // Verify that the result is the expected error
      expect(result).toEqual(new Error('Invalid recordId'));
    });

    // Return response data after deleting a medical record
    it('should successfully delete a medical record with valid recordId and signer', async () => {
      // Mock axios.post to return a successful response
      axios.post = jest.fn().mockResolvedValue({ data: 'Record deleted' });

      // Call the DeleteMedicalRecord function with valid recordId and signer
      const result = await DeleteMedicalRecord('validRecordId', 'validSigner');

      // Verify that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/transactions`, {
        "headers": {
          "type": "SendTransaction",
          "signer": 'validSigner',
          "channel": CHANNEL,
          "chaincode": CHAINCODE
        },
        "func": "DeleteMedicalRecord",
        "args": ['validRecordId']
      }, { headers });

      // Verify that the result is the expected response
      expect(result).toBe('Record deleted');
    });

    // Handle and return error if deletion fails
    it('should handle and return error when deletion fails', async () => {
      // Mock axios.post to throw an error
      axios.post = jest.fn().mockRejectedValue(new Error('Deletion failed'));

      // Call the DeleteMedicalRecord function with a recordId and signer
      const result = await DeleteMedicalRecord('recordId', 'signer');

      // Verify that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/transactions`, {
        "headers": {
          "type": "SendTransaction",
          "signer": 'signer',
          "channel": CHANNEL,
          "chaincode": CHAINCODE
        },
        "func": "DeleteMedicalRecord",
        "args": ['recordId']
      }, { headers });

      // Verify that the result is the expected error
      expect(result).toEqual(new Error('Deletion failed'));
    });

    // Attempt to delete a medical record with missing recordId
    it('should return an error when recordId is missing', async () => {
      // Call the DeleteMedicalRecord function with missing recordId
      const result = await DeleteMedicalRecord(undefined, 'validSigner');

      // Verify that axios.post was not called
      expect(axios.post).not.toHaveBeenCalled();

      // Verify that the result is an error
      expect(result).toBeInstanceOf(Error);
    });

    // Attempt to delete a medical record with missing signer
    it('should return an error when signer is missing', async () => {
      // Call the DeleteMedicalRecord function with missing signer
      const result = await DeleteMedicalRecord('recordId', undefined);

      // Verify that axios.post was not called
      expect(axios.post).not.toHaveBeenCalled();

      // Verify that the result is an error
      expect(result).toBeInstanceOf(Error);
    });

    // Attempt to delete a medical record with an invalid signer
    it('should fail to delete a medical record with an invalid signer', async () => {
      // Mock axios.post to throw an error
      axios.post = jest.fn().mockRejectedValue(new Error('Invalid signer'));

      // Call the DeleteMedicalRecord function with an invalid signer
      const result = await DeleteMedicalRecord('recordId', 'invalidSigner');

      // Verify that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/transactions`, {
        "headers": {
          "type": "SendTransaction",
          "signer": 'invalidSigner',
          "channel": CHANNEL,
          "chaincode": CHAINCODE
        },
        "func": "DeleteMedicalRecord",
        "args": ['recordId']
      }, { headers });

      // Verify that the result is an error
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Invalid signer');
    });

    // Verify that the function sends a POST request to the correct endpoint
    it('should successfully delete a medical record with valid recordId and signer', async () => {
      // Mock axios.post to return a successful response
      axios.post = jest.fn().mockResolvedValue({ data: 'Record deleted' });

      // Call the DeleteMedicalRecord function with valid recordId and signer
      const result = await DeleteMedicalRecord('validRecordId', 'validSigner');

      // Verify that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/transactions`, {
        "headers": {
          "type": "SendTransaction",
          "signer": 'validSigner',
          "channel": CHANNEL,
          "chaincode": CHAINCODE
        },
        "func": "DeleteMedicalRecord",
        "args": ['validRecordId']
      }, { headers });

      // Verify that the result is the expected response
      expect(result).toBe('Record deleted');
    });

    // Verify that the function sends the correct headers in the POST request
    it('should send the correct headers in the POST request', async () => {
      // Mock axios.post to return a successful response
      axios.post = jest.fn().mockResolvedValue({ data: 'Record deleted' });

      // Call the DeleteMedicalRecord function with valid recordId and signer
      const result = await DeleteMedicalRecord('validRecordId', 'validSigner');

      // Verify that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/transactions`, {
        "headers": {
          "type": "SendTransaction",
          "signer": 'validSigner',
          "channel": CHANNEL,
          "chaincode": CHAINCODE
        },
        "func": "DeleteMedicalRecord",
        "args": ['validRecordId']
      }, { headers });

      // Verify that the result is the expected response
      expect(result).toBe('Record deleted');
    });

    // Verify that the function sends the correct arguments in the POST request
    it('should successfully delete a medical record with valid recordId and signer', async () => {
      // Mock axios.post to return a successful response
      axios.post = jest.fn().mockResolvedValue({ data: 'Record deleted' });

      // Call the DeleteMedicalRecord function with valid recordId and signer
      const result = await DeleteMedicalRecord('validRecordId', 'validSigner');

      // Verify that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/transactions`, {
        "headers": {
          "type": "SendTransaction",
          "signer": 'validSigner',
          "channel": CHANNEL,
          "chaincode": CHAINCODE
        },
        "func": "DeleteMedicalRecord",
        "args": ['validRecordId']
      }, { headers });

      // Verify that the result is the expected response
      expect(result).toBe('Record deleted');
    });

    // Verify that the function uses the correct channel and chaincode
    it('should successfully delete a medical record with valid recordId and signer', async () => {
      // Mock axios.post to return a successful response
      axios.post = jest.fn().mockResolvedValue({ data: 'Record deleted' });

      // Call the DeleteMedicalRecord function with valid recordId and signer
      const result = await DeleteMedicalRecord('validRecordId', 'validSigner');

      // Verify that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/transactions`, {
        "headers": {
          "type": "SendTransaction",
          "signer": 'validSigner',
          "channel": CHANNEL,
          "chaincode": CHAINCODE
        },
        "func": "DeleteMedicalRecord",
        "args": ['validRecordId']
      }, { headers });

      // Verify that the result is the expected response
      expect(result).toBe('Record deleted');
    });

    // Verify that the function handles network errors
    it('should handle network errors when deleting a medical record', async () => {
      // Mock axios.post to throw an error
      axios.post = jest.fn().mockRejectedValue(new Error('Network error'));

      // Call the DeleteMedicalRecord function with a valid recordId and signer
      const result = await DeleteMedicalRecord('validRecordId', 'validSigner');

      // Verify that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/transactions`, {
        "headers": {
          "type": "SendTransaction",
          "signer": 'validSigner',
          "channel": CHANNEL,
          "chaincode": CHAINCODE
        },
        "func": "DeleteMedicalRecord",
        "args": ['validRecordId']
      }, { headers });

      // Verify that the result is the expected error
      expect(result).toEqual(new Error('Network error'));
    });
});

describe('getAllAppointments', () => {

    // Successfully retrieve all medical records for a patient with valid PatientId and signer
    it('should successfully retrieve all medical records for a patient with valid PatientId and signer', async () => {
      // Mock axios.post to return a successful response
      axios.post.mockResolvedValueOnce({ data: { result: 'medical records' } });

      // Call the function under test
      const result = await getAllAppointments('validPatientId', 'validSigner');

      // Verify the result
      expect(result).toEqual('medical records');
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllMedicalRecordsForOnePatient",
        "args": ['validPatientId']
      }, { headers });
    });

    // Return error when PatientId is null
    it('should return error when PatientId is null', async () => {
      // Call the function under test with null PatientId
      const result = await getAllAppointments(null, 'validSigner');

      // Verify the result
      expect(result).toBeInstanceOf(Error);
      expect(axios.post).not.toHaveBeenCalled();
    });

    // Return empty array when patient has no medical records
    it('should return an empty array when the patient has no medical records', async () => {
      // Mock axios.post to return an empty response
      axios.post.mockResolvedValueOnce({ data: { result: [] } });

      // Call the function under test
      const result = await getAllAppointments('patientId', 'signer');

      // Verify the result
      expect(result).toEqual([]);
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'signer',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllMedicalRecordsForOnePatient",
        "args": ['patientId']
      }, { headers });
    });

    // Return empty array when patientId does not exist in the blockchain
    it('should return an empty array when patientId does not exist in the blockchain', async () => {
      // Mock axios.post to return an empty response
      axios.post.mockResolvedValueOnce({ data: { result: [] } });

      // Call the function under test
      const result = await getAllAppointments('nonExistentPatientId', 'validSigner');

      // Verify the result
      expect(result).toEqual([]);
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllMedicalRecordsForOnePatient",
        "args": ['nonExistentPatientId']
      }, { headers });
    });

    // Return empty array when signer does not have permission to access patient's medical records
    it('should return an empty array when signer does not have permission to access patients medical records', async () => {
      // Mock axios.post to return an error response
      axios.post.mockRejectedValueOnce({ error: "Permission denied" });

      // Call the function under test
      const result = await getAllAppointments('patientId', 'invalidSigner');

      // Verify the result
      expect(result).toEqual([]);
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'invalidSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllMedicalRecordsForOnePatient",
        "args": ['patientId']
      }, { headers });
    });

    // Return array of medical records when patient has multiple medical records
    it('should successfully retrieve all medical records for a patient with multiple medical records', async () => {
      // Mock axios.post to return a successful response
      axios.post.mockResolvedValueOnce({ data: { result: 'medical records' } });

      // Call the function under test
      const result = await getAllAppointments('validPatientId', 'validSigner');

      // Verify the result
      expect(result).toEqual('medical records');
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllMedicalRecordsForOnePatient",
        "args": ['validPatientId']
      }, { headers });
    });

    // Return error when signer is null
    it('should return an error when signer is null', async () => {
      // Call the function under test with null signer
      const result = await getAllAppointments('validPatientId', null);

      // Verify the result
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Error: Request failed with status code 400');
    });

    // Return error when kaleidoPatUrl is null
    it('should return an error when kaleidoPatUrl is null', async () => {
      // Mock axios.post to throw an error
      axios.post.mockRejectedValueOnce('kaleidoPatUrl is null');

      // Call the function under test
      const result = await getAllAppointments('validPatientId', 'validSigner');

      // Verify the result
      expect(result).toEqual('kaleidoPatUrl is null');
      expect(axios.post).not.toHaveBeenCalled();
    });

    // Return error when response from blockchain is null
    it('should return an error when the response from the blockchain is null', async () => {
      // Mock axios.post to return a null response
      axios.post.mockResolvedValueOnce({ data: null });

      // Call the function under test
      const result = await getAllAppointments('validPatientId', 'validSigner');

      // Verify the result
      expect(result).toEqual(expect.any(Error));
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllMedicalRecordsForOnePatient",
        "args": ['validPatientId']
      }, { headers });
    });

    // Return error when response from blockchain is not in expected format
    it('should return an error when the response from the blockchain is not in the expected format', async () => {
      // Mock axios.post to return an invalid response
      axios.post.mockResolvedValueOnce({ data: { error: 'Invalid response' } });

      // Call the function under test
      const result = await getAllAppointments('validPatientId', 'validSigner');

      // Verify the result
      expect(result).toEqual({ error: 'Invalid response' });
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllMedicalRecordsForOnePatient",
        "args": ['validPatientId']
      }, { headers });
    });

    // Verify that the function is making a POST request to the correct endpoint
    it('should make a POST request to the correct endpoint when retrieving all medical records for a patient', async () => {
      // Mock axios.post to return a successful response
      axios.post.mockResolvedValueOnce({ data: { result: 'medical records' } });

      // Call the function under test
      const result = await getAllAppointments('validPatientId', 'validSigner');

      // Verify the result
      expect(result).toEqual('medical records');
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllMedicalRecordsForOnePatient",
        "args": ['validPatientId']
      }, { headers });
    });

    // Verify that the function is passing the correct arguments in the POST request
    it('should successfully retrieve all medical records for a patient with valid PatientId and signer', async () => {
      // Mock axios.post to return a successful response
      axios.post.mockResolvedValueOnce({ data: { result: 'medical records' } });

      // Call the function under test
      const result = await getAllAppointments('validPatientId', 'validSigner');

      // Verify the result
      expect(result).toEqual('medical records');
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllMedicalRecordsForOnePatient",
        "args": ['validPatientId']
      }, { headers });
    });

    // Verify that the function is returning the correct data type
    it('should return the correct data type when retrieving all appointments for a patient', async () => {
      // Mock axios.post to return a successful response
      axios.post.mockResolvedValueOnce({ data: { result: 'medical records' } });

      // Call the function under test
      const result = await getAllAppointments('validPatientId', 'validSigner');

      // Verify the result
      expect(typeof result).toBe('string');
      expect(result).toEqual('medical records');
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllMedicalRecordsForOnePatient",
        "args": ['validPatientId']
      }, { headers });
    });
});

describe('getChronicDieases', () => {

    // Successfully retrieve chronic diseases for a patient with valid PatientId and signer
    it('should successfully retrieve chronic diseases for a patient with valid PatientId and signer', async () => {
      // Mock axios.post to return a response with data
      axios.post = jest.fn().mockResolvedValue({ data: { result: 'chronic diseases' } });

      // Call the function with valid PatientId and signer
      const result = await getChronicDieases('validPatientId', 'validSigner');

      // Check that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllChronicDiseasesForOnePatient",
        "args": ['validPatientId']
      }, { headers });

      // Check that the result is the expected data
      expect(result).toBe('chronic diseases');
    });

    // Throw an error when PatientId is null
    it('should throw an error when PatientId is null', async () => {
      // Call the function with null PatientId
      const result = await getChronicDieases(null, 'validSigner');

      // Check that the result is an error
      expect(result).toBeInstanceOf(Error);
    });

    // Return an empty array when there are no chronic diseases for the given PatientId
    it('should return an empty array when there are no chronic diseases for the given PatientId', async () => {
      // Mock axios.post to return a response with an empty array
      axios.post = jest.fn().mockResolvedValue({ data: { result: [] } });

      // Call the function with a PatientId and signer
      const result = await getChronicDieases('PatientId', 'signer');

      // Check that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'signer',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllChronicDiseasesForOnePatient",
        "args": ['PatientId']
      }, { headers });

      // Check that the result is an empty array
      expect(result).toEqual([]);
    });

    // Return the correct chronic diseases for a patient with multiple chronic diseases
    it('should successfully retrieve chronic diseases for a patient with valid PatientId and signer', async () => {
      // Mock axios.post to return a response with data
      axios.post = jest.fn().mockResolvedValue({ data: { result: 'chronic diseases' } });

      // Call the function with valid PatientId and signer
      const result = await getChronicDieases('validPatientId', 'validSigner');

      // Check that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllChronicDiseasesForOnePatient",
        "args": ['validPatientId']
      }, { headers });

      // Check that the result is the expected data
      expect(result).toBe('chronic diseases');
    });

    // Throw an error when signer is null
    it('should throw an error when signer is null', async () => {
      // Call the function with null signer
      const result = await getChronicDieases('validPatientId', null);

      // Check that the result is an error
      expect(result).toBeInstanceOf(Error);
    });

    // Throw an error when the response from the blockchain service is not in the expected format
    it('should throw an error when the response from the blockchain service is not in the expected format', async () => {
      // Mock axios.post to return a response with incorrect data format
      axios.post = jest.fn().mockResolvedValue({ data: { error: 'Invalid response format' } });

      // Call the function with valid PatientId and signer
      const result = await getChronicDieases('validPatientId', 'validSigner');

      // Check that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllChronicDiseasesForOnePatient",
        "args": ['validPatientId']
      }, { headers });

      // Check that the result is an error
      expect(result).toBeInstanceOf(Error);
    });

    // Throw an error when the blockchain service returns an error
    it('should throw an error when the blockchain service returns an error', async () => {
      // Mock axios.post to throw an error
      axios.post = jest.fn().mockRejectedValue(new Error('Blockchain service error'));

      // Call the function with valid PatientId and signer
      const result = await getChronicDieases('validPatientId', 'validSigner');

      // Check that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllChronicDiseasesForOnePatient",
        "args": ['validPatientId']
      }, { headers });

      // Check that the result is the expected error
      expect(result).toEqual(new Error('Blockchain service error'));
    });

    // Test the function with PatientId and signer values that have special characters
    it('should successfully retrieve chronic diseases for a patient with special characters in PatientId and signer', async () => {
      // Mock axios.post to return a response with data
      axios.post = jest.fn().mockResolvedValue({ data: { result: 'chronic diseases' } });

      // Call the function with special characters in PatientId and signer
      const result = await getChronicDieases('PatientId!@#', 'signer!@#');

      // Check that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'signer!@#',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllChronicDiseasesForOnePatient",
        "args": ['PatientId!@#']
      }, { headers });

      // Check that the result is the expected data
      expect(result).toBe('chronic diseases');
    });

    // Test the function with PatientId and signer values that are not valid for the blockchain service
    it('should return an error when PatientId and signer values are not valid', async () => {
      // Mock axios.post to throw an error
      axios.post = jest.fn().mockRejectedValue('Invalid values');

      // Call the function with invalid PatientId and signer
      const result = await getChronicDieases('invalidPatientId', 'invalidSigner');

      // Check that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'invalidSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllChronicDiseasesForOnePatient",
        "args": ['invalidPatientId']
      }, { headers });

      // Check that the result is an error
      expect(result).toBeInstanceOf(Error);
    });

    // Test the function with PatientId and signer values that are longer than the maximum allowed length
    it('should throw an error when PatientId and signer values are longer than the maximum allowed length', async () => {
      // Mock axios.post to throw an error
      axios.post = jest.fn().mockRejectedValue(new Error('Maximum allowed length exceeded'));

      // Call the function with long PatientId and signer values
      const result = await getChronicDieases('longPatientId', 'longSigner');

      // Check that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'longSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllChronicDiseasesForOnePatient",
        "args": ['longPatientId']
      }, { headers });

      // Check that the result is an error
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Maximum allowed length exceeded');
    });

    // Test the function with different values for CHAINCODE and CHANNEL
    it('should successfully retrieve chronic diseases for a patient with valid PatientId and signer', async () => {
      // Mock axios.post to return a response with data
      axios.post = jest.fn().mockResolvedValue({ data: { result: 'chronic diseases' } });

      // Call the function with valid PatientId and signer
      const result = await getChronicDieases('validPatientId', 'validSigner');

      // Check that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllChronicDiseasesForOnePatient",
        "args": ['validPatientId']
      }, { headers });

      // Check that the result is the expected data
      expect(result).toBe('chronic diseases');
    });

    // Test the function with different values for kaleidoPatUrl
    it('should successfully retrieve chronic diseases for a patient with valid PatientId and signer', async () => {
      // Mock axios.post to return a response with data
      axios.post = jest.fn().mockResolvedValue({ data: { result: 'chronic diseases' } });

      // Call the function with valid PatientId and signer
      const result = await getChronicDieases('validPatientId', 'validSigner');

      // Check that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllChronicDiseasesForOnePatient",
        "args": ['validPatientId']
      }, { headers });

      // Check that the result is the expected data
      expect(result).toBe('chronic diseases');
    });

    // Retrieve chronic diseases for a patient with a valid PatientId and signer
    it('should successfully retrieve chronic diseases for a patient with valid PatientId and signer', async () => {
      // Mock axios.post to return a response with data
      axios.post = jest.fn().mockResolvedValue({ data: { result: 'chronic diseases' } });

      // Call the function with valid PatientId and signer
      const result = await getChronicDieases('validPatientId', 'validSigner');

      // Check that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllChronicDiseasesForOnePatient",
        "args": ['validPatientId']
      }, { headers });

      // Check that the result is the expected data
      expect(result).toBe('chronic diseases');
    });

    // Verify that the response contains the expected chronic diseases
    it('should successfully retrieve chronic diseases for a patient with valid PatientId and signer', async () => {
      // Mock axios.post to return a response with data
      axios.post = jest.fn().mockResolvedValue({ data: { result: 'chronic diseases' } });

      // Call the function with valid PatientId and signer
      const result = await getChronicDieases('validPatientId', 'validSigner');

      // Check that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'validSigner',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllChronicDiseasesForOnePatient",
        "args": ['validPatientId']
      }, { headers });

      // Check that the result is the expected data
      expect(result).toBe('chronic diseases');
    });

    // Retrieve chronic diseases for a patient with no chronic diseases
    it('should return an empty array when there are no chronic diseases for the given PatientId', async () => {
      // Mock axios.post to return a response with an empty array
      axios.post = jest.fn().mockResolvedValue({ data: { result: [] } });

      // Call the function with a PatientId and signer
      const result = await getChronicDieases('PatientId', 'signer');

      // Check that axios.post was called with the correct arguments
      expect(axios.post).toHaveBeenCalledWith(`${kaleidoPatUrl}/query`, {
        "headers":{
            "signer": 'signer',
            "channel": CHANNEL,
            "chaincode": CHAINCODE
        },
        "func": "GetAllChronicDiseasesForOnePatient",
        "args": ['PatientId']
      }, { headers });

      // Check that the result is an empty array
      expect(result).toEqual([]);
    });
});
