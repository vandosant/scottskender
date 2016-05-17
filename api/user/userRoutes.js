let router = require('express').Router();
let userModel = require('./userModel')

router.route('/')
  .get(function(req, res) {
    console.log('users route');
    userModel.find()
    .then(function(doc) {
      res.json(doc);
    });
  });

module.exports = router;
