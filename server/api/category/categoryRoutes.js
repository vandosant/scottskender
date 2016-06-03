let router = require('express').Router();
let categoryModel = require('./categoryModel')

router.route('/')
  .get(function(req, res) {
    console.log('category route')
    categoryModel.find()
    .then(function(doc) {
      res.json(doc)
    })
})

module.exports = router
