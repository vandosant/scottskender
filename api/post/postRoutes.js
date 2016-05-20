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
    });
  })
  .put(function(req, res) {
    postModel.findById(req.params.id)
      .then(function(post) {
	const postUpdates = Object.assign(post, req.body)
        post.update(postUpdates)
	  .then(function() {
            res.json(postUpdates);
	  }, function(err) {
            console.error('Err updating post', err);
	  });
      }, function(err) {
        console.error('Err finding post to update', err);
      });
  });
module.exports = router
