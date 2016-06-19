const yo = require('yo-yo')
const Posts = require('./postModel')

Posts.load()
.then(function(posts) {
  console.log(posts);
})
