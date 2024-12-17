const express = require('express');

const mongoose = require('mongoose');

const grid = require('gridfs-stream');

const router = express.Router();

const {upload} = require('./upload.js')


let gfs, gridfsBucket;

(() => {
  mongoose.connection.on("connected", () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    gfs = grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
  });
})();



const getFileToBase64 = async (filename, res) => {
    const file = await gfs.files.findOne({ filename });
    const readStream = gridfsBucket.openDownloadStream(file._id);
    const bufs = []
    readStream.on('data', (chunk) => {
        bufs.push(chunk)
    })
    let base64;
    readStream.on('end', () => {
        const fbuf = Buffer.concat(bufs);
        base64 = fbuf.toString('base64');
        return res.json({data: base64})
    });

}

const getBase64FileData = async (filename) => {
    const file = await gfs.files.findOne({ filename });
    const readStream = gridfsBucket.openDownloadStream(file._id);
    const bufs = []
    readStream.on('data', (chunk) => {
        bufs.push(chunk)
    })
    let base64;
    readStream.on('end', () => {
        const fbuf = Buffer.concat(bufs);
        base64 = fbuf.toString('base64');
        return  base64
    });

}


// media_api_router.use(`/upload`, upload().single("file"))

router.post(`/upload`, upload().single("file"), async (request, response) => {
    
    try {
        const result = {success: true, filename: request.file.filename}
        response.json(result);
    } catch (error) {
        response.json({success: false, message: error.message});
    }
})


router.get(`/download/:filename`, async (request, response) => {
    let filename = request.params.filename
    try {
         await getFileToBase64(filename, response)
    } catch (error) {
        response.json({message: error.message});
    }
})

const fileRemove = async (request, response) => {
    let filename = request.params.filename
    try {
        const file = await gfs.files.findOne({ filename });

        await gridfsBucket.delete(file._id);
        response.json({removed: filename})
    } catch (error) {
        response.json({message: error.message});
    }
}

router.delete(`/remove/:filename`, fileRemove)





module.exports = {router, fileRemove, getBase64FileData}