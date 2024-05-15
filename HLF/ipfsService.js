const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();
// ipfsKey = 'FzfsXnghRuapU5Rg4PkF95oXzvVd1EPT9Al4L8pk';
// ipfsUrl = 'https://65f4cc0c14d31cebc0d4b9c0.ipfs-us-west-2.spydra.app';


// // upload a file to IPFS



const ipfsUrl = process.env.kaleidoIPFSUrl;
const ipfsKey =  process.env.kaleidoKEY;
;
const headers = {
    'accept': '*/*',
    'Authorization': ipfsKey,
    'Content-Type': '*/*'
};async function uploadFileToIPFS(file) {
    try {
        const formData = new FormData();
        const blob = new Blob([file.buffer], { type: 'application/octet-stream' });
        formData.append('file', blob, file.originalname);

        const response = await axios.post(`${ipfsUrl}/add`, formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'accept': '*/*',
                'Authorization': ipfsKey
            }
        });

        console.log('File uploaded to IPFS:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return error;
    }
}




async function getFileFromIPFS(hash) {
    try {
        const response = await axios.post(`${ipfsUrl}/cat/${hash}`, null, {
            headers: {
                'accept': '*/*',
                'Authorization': ipfsKey,
                'Content-Type': '*/*'
            },
            responseType: 'arraybuffer' // change this to 'arraybuffer'
        });

        return response.data; // return the data directly
    } catch (error) {
        console.error('Error:', error);
        return error;
    }
}


// async function uploadFileToIPFS(file) {
//     try {
//         const fileSize = file.size;
//         let response;
        
//         if (fileSize <= 4 * 1024 * 1024) {
//             const formData = new FormData();
//             formData.append('file', file.buffer, { filename: file.originalname });
            
//             response = await axios.post(`${ipfsUrl}/ipfs/add`, formData, {
//                 headers: {
//                     'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
//                     'accept': '*/*',
//                     'X-API-KEY': ipfsKey
//                 }
//             });
//         } else {
//             // Use /ipfs/addByUrl endpoint for files larger than 4MB
//             response = await axios.post(`${ipfsUrl}/ipfs/addByUrl?url=${file.originalname}`, {}, {
//                 headers: {
//                     'accept': '*/*',
//                     'X-API-KEY': ipfsKey
//                 }
//             });
//         }
//         console.log('File uploaded to IPFS:', response);
//         return response.data;
//     } catch (error) {
//         console.error('Error:', error);
//         return error;
//     }
// }


// // get a file from IPFS

// async function getFileFromIPFS(hash) {
//     try {
//         const response = await axios.post(`${ipfsUrl}/ipfs/cat?arg=${hash}`, null,{ headers: headers, responseType: 'stream' });
//         console.log('File from IPFS:', response);

       
//         return response.data;
//     } catch (error) {
//         console.error('Error:', error);
//         return error;
//     }
// }



// delete a file from IPFS
async function deleteFileFromIPFS(hash) {
    try {
        const response = await axios.post(`${ipfsUrl}/ipfs/pin/rm?arg=${hash}`,null,{ headers});
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}
// get all files from IPFS
 async function getAllFilesFromIPFS() {
        try {
            const response = await axios.post(`${ipfsUrl}/ipfs/pin/ls`, null, {headers});
            console.log('All files from IPFS:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting all files from IPFS:', error);
        }
    }
module.exports = { uploadFileToIPFS, getFileFromIPFS, deleteFileFromIPFS, getAllFilesFromIPFS };
