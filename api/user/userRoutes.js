let router = require('express').Router();
let User = require('./userModel')
const signToken = require('../../auth/auth').signToken;

router.route('/')
  .get(function(req, res) {
    User.find()
    .then(function(doc) {
      res.json(doc);
    });
  })
  .post(function(req, res, next) {
    User.create(req.body)
    .then(function(user) {
      res.json({token: signToken(user._id)});
    }, function(err) {
      console.log(err);
      next(err);
    });
  });
module.exports = router;
