const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

//define the user schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  certificates: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Certificate' }]
});

//apply the uniqueValidator plugin to enforce unique email validation
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);