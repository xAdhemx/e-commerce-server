const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require('crypto');
const path = require('path');


const upload = () => {
  const storage = new GridFsStorage({
    url: process.env.MONGODB_URL,
    file: (req, file) => {
        // if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        //   return Promise.reject('Invalid file type. Only images are allowed.');
        // }
          return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
              if (err) {
                return reject(err);
              }
              const filename = buf.toString('hex') + path.extname(file.originalname);
              const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
              };
              req.filename = filename;
              resolve(fileInfo);
            });
          });
        }
    });

    return multer({ storage });
}




module.exports = {upload };
