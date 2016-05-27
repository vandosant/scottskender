let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  }
});

let UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel;
