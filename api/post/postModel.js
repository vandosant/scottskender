let mongoose = require('mongoose')

let PostSchema = new mongoose.Schema({
  title: String,
  body: {
    type: String,
    required: true
  }
})

let PostModel = mongoose.model('posts', PostSchema)
PostModel.create(
  {title: 'Another dev blurb', body: 'I am telling you some opinions here'}
).then(function(err, post) {
  console.log(err, post);
});

module.exports = PostModel
