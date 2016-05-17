let mongoose = require('mongoose');

let CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

let CategoryModel = mongoose.model('categories', CategorySchema);

module.exports = CategoryModel;
