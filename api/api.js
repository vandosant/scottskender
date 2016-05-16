let router = require('express').Router()

let posts = require('./post/postRoutes')

router.use('/posts', posts)

module.exports = router
