let postModel = require('./postModel');

exports.get = function (req, res) {
  postModel.find()
  .then(function(doc) {
    res.json(doc)
  })
};

exports.create = function (req, res, next) {
  postModel.create(req.body, function(err, newPost) {
  if (err) {
    console.error(err);
    next(err);
  }
    res.json(newPost);
  }) 
};

exports.getOne = function (req, res, next) {
  postModel.findOne({_id: req.params.id}, function(err, post) {
    if (err) {
      next(new Error('Post not found'));
    } else {
      res.json(post)
    }
  });
};

exports.update = function (req, res, next) {
  postModel.findById(req.params.id)
    .then(function(post) {
      const postUpdates = Object.assign(post, req.body)
      post.update(postUpdates)
        .then(function() {
          res.json(postUpdates);
        }, function(err) {
          console.error('Err updating post', err);
	  next(err);
        });
    }, function(err) {
      console.error('Err finding post to update', err);
      next(err);
    });
};
