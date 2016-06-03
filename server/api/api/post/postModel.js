let mongoose = require('mongoose')

let PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId
  }]
})

let PostModel = mongoose.model('post', PostSchema)

module.exports = PostModel
