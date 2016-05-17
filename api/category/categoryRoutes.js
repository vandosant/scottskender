let router = require('express').Router();

router.route('/')
  .get(function(req, res) {
    console.log('category route')
    res.json([])
})

module.exports = router
