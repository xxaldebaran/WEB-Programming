const multer = require('multer');
//const uuid = require('uuid/v1');
const {v1: uuidv4 } = require('uuid');

//map of MIME types to file extensions
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

//create a multer middleware for file uploads
const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      //get the file extension based on the MIME type
      const ext = MIME_TYPE_MAP[file.mimetype];
      //generate a unique filename using UUID and the file extension
      cb(null, uuidv4() + '.' + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    //check if the MIME type of the file is valid
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    //create an error if the MIME type is invalid
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});

module.exports = fileUpload;

