let router = require('express').Router()

router.route('/')
  .get(function(req, res) { 
    console.log('posts route')
    res.send([])
  })

module.exports = router
