//importing required modules and models
const fs = require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Certificate = require('../models/certificate');
const User = require('../models/user');

//getting a certificate by ID
const getCertificateById = async (req, res, next) => {
  const certificateId = req.params.pid;

  let certificate;
  try {
    certificate = await Certificate.findById(certificateId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a certificate.',
      500
    );
    return next(error);
  }

  if (!certificate) {
    const error = new HttpError(
      'Could not find certificate for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ certificate: certificate.toObject({ getters: true }) });
};

//getting all certificates for a user
const getCertificatesByUserId = async (req, res, next) => {

  const userId = req.params.uid;

  let userWithCertificates;
  try {
    userWithCertificates = await User.findById(userId).populate('certificates');
  } catch (err) {
    const error = new HttpError(
      'Fetching certificates failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!userWithCertificates || userWithCertificates.certificates.length === 0) {
    return next(
      new HttpError('Could not find certificates for the provided user id.', 404)
    );
  }

  res.json({
    certificates: userWithCertificates.certificates.map(certificate =>
      certificate.toObject({ getters: true })
    )
  });
};

//create a new certificate
const createCertificate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;

  const createdCertificate = new Certificate({
    title,
    description,
    image: req.file.path,
    creator: req.userData.userId
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Creating certificate failed, please try again.',
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  }

  console.log(user);

  try {
    //start a session and transaction to ensure atomicity
    const sess = await mongoose.startSession();
    sess.startTransaction();

    //save the new certificate and update the user's certificate list
    await createdCertificate.save({ session: sess });
    user.certificates.push(createdCertificate);
    await user.save({ session: sess });

    //commit the transaction
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating certificate failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ certificate: createdCertificate });
};

//update an existing certificate
const updateCertificate = async (req, res, next) => {
  const errors = validationResult(req);
  //check if there are any validation errors
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const certificateId = req.params.pid;

  let certificate;
  try {
    certificate = await Certificate.findById(certificateId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update certificate.',
      500
    );
    return next(error);
  }

  //check if the user is authorized to edit the certificate
  if (certificate.creator.toString() !== req.userData.userId) {
    const error = new HttpError('You are not allowed to edit this certificate.', 401);
    return next(error);
  }

  //update the certificate properties
  certificate.title = title;
  certificate.description = description;

  try {
    await certificate.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update certificate.',
      500
    );
    return next(error);
  }

  res.status(200).json({ certificate: certificate.toObject({ getters: true }) });
};

const deleteCertificate = async (req, res, next) => {
  const certificateId = req.params.pid;
  console.log(certificateId)

  let certificate;
  try {
    certificate = await Certificate.findById(certificateId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete certificate.',
      500
    );
    return next(error);
  }

  //check if the certificate exists
  if (!certificate) {
    const error = new HttpError('Could not find certificate for this id.', 404);
    return next(error);
  }

  //check if the user is authorized to delete the certificate
  if (certificate.creator.id !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to delete this certificate.',
      401
    );
    return next(error);
  }

  const imagePath = certificate.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await certificate.deleteOne({ _id: certificateId });

    certificate.creator.certificates.pull(certificate);

    await certificate.creator.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete certificate.',
      500
    );
    return next(error);
  }

  //delete the certificate image file
  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted certificate.' });
};

exports.getCertificateById = getCertificateById;
exports.getCertificatesByUserId = getCertificatesByUserId;
exports.createCertificate = createCertificate;
exports.updateCertificate = updateCertificate;
exports.deleteCertificate = deleteCertificate;