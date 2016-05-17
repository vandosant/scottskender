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

module.exports = router
