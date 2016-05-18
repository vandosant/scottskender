let router = require('express').Router()
let postModel = require('./postModel')

router.route('/')
  .get(function(req, res) { 
    console.log('posts route')
    postModel.find()
    .then(function(doc) {
      res.json(doc)
    })
  })
  .post(function(req, res) {
    postModel.create(req.body, function(err, newPost) {
      if (err) {
        console.error(err);
      }
      res.json(newPost);
    })
  })

router.route('/:id')
  .get(function(req, res) {
    postModel.findOne({_id: req.params.id}, function(err, post) {
      if (err) {
        console.error(err);
      }
      res.json(post)
    })
  })
module.exports = router
