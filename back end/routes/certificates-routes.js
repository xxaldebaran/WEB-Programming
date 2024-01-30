const express = require('express');
const { check } = require('express-validator');

const certificatesControllers = require('../controllers/certificates-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
//get a certificate by ID
router.get('/:pid', certificatesControllers.getCertificateById);
//get certificates by user ID
router.get('/user/:uid', certificatesControllers.getCertificatesByUserId);
//middleware to authenticate requests
router.use(checkAuth);

//create a new certificate
router.post(
  '/',
  //middleware for handling file uploads
  fileUpload.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
  ],
  //controller function for creating a certificate
  certificatesControllers.createCertificate
);

//update a certificate by ID
router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  certificatesControllers.updateCertificate
);

//delete a certificate by ID
router.delete('/:pid', certificatesControllers.deleteCertificate);

module.exports = router;
