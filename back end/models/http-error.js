class HttpError extends Error {
  constructor(message, errorCode) {
    //call the constructor of the parent class (Error) with the error message
    super(message);
    //set the error code as a property of the HttpError instance
    this.code = errorCode;
  }
}

module.exports = HttpError;