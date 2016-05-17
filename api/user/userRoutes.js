let router = require('express').Router();

router.route('/')
  .get(function(req, res) {
    console.log('users route');
    res.json([]);
  });

module.exports = router;
