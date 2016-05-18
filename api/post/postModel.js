let mongoose = require('mongoose')

let PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId
  }]
})

let PostModel = mongoose.model('posts', PostSchema)

module.exports = PostModel
