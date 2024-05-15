// __tests__/ipfsOperations.test.js
const axios = require('axios');
const { uploadFileToIPFS, getFileFromIPFS, deleteFileFromIPFS, getAllFilesFromIPFS } = require('../../HLF/ipfsService');

describe('IPFS Operations', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('uploadFileToIPFS', () => {
    it('uploads a file to IPFS and returns the hash', async () => {
      const mockResponse = { data: 'QmExampleHash' }; // Example hash
      axios.post.mockResolvedValue(mockResponse);

      const result = await uploadFileToIPFS(/* pass your file here */);
      expect(result).toBe(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/add'), expect.anything(), expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': expect.stringContaining('multipart/form-data'),
        }),
      }));
    });
  });

  describe('getFileFromIPFS', () => {
    it('retrieves a file from IPFS using its hash', async () => {
      const mockResponse = Buffer.from('Hello, World'); // Simulate binary data
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await getFileFromIPFS('QmExampleHash');
      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/cat/QmExampleHash'), undefined, expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': expect.stringContaining('*/*'),
        }),
      }));
    });
  });

  describe('deleteFileFromIPFS', () => {
    it('deletes a file from IPFS using its hash', async () => {
      const mockResponse = {}; // No data expected
      axios.post.mockResolvedValue(mockResponse);

      await deleteFileFromIPFS('QmExampleHash');
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/pin/rm?arg=QmExampleHash'), undefined, expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': expect.stringContaining('*/*'),
        }),
      }));
    });
  });

  describe('getAllFilesFromIPFS', () => {
    it('lists all files from IPFS', async () => {
      const mockResponse = [{ hash: 'QmExampleHash1' }, { hash: 'QmExampleHash2' }];
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await getAllFilesFromIPFS();
      expect(result).toEqual(mockResponse);
      expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/pin/ls'), undefined, expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': expect.stringContaining('*/*'),
        }),
      }));
    });
  });
});
