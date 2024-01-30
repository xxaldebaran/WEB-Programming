const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//define the certificate schema
const certificateSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

//export the certificate model
module.exports = mongoose.model('Certificate', certificateSchema);

