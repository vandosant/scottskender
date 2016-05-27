let router = require('express').Router();
let userModel = require('./userModel')

router.route('/')
  .get(function(req, res) {
    console.log('users route');
    userModel.find()
    .then(function(doc) {
      res.json(doc);
    });
  })
  .post(function(req, res, next) {
    userModel.create(req.body)
    .then(function(user) {
      res.json(user);
    }, function(err) {
      console.log(err);
      next(err);
    });
  });
module.exports = router;
