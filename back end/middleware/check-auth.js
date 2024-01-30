const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

//middleware function for authentication
module.exports = (req, res, next) => {
  //check if the request method is 'OPTIONS'
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    //extract the token from the 'Authorization' header (Bearer TOKEN)
    const token = req.headers.authorization.split(' ')[1]; 

    //check if a token exists
    if (!token) {
      throw new Error('Authentication failed!');
    }
    //verify the token and decode its payload
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');

    //add the decoded user ID to the request object
    req.userData = { userId: decodedToken.userId };
    //call the next middleware function
    next();
  } catch (err) {
    //handle authentication failure
    const error = new HttpError('Authentication failed!', 403);
    return next(error);
  }
};