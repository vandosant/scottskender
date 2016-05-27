let router = require('express').Router()
let postModel = require('./postModel')
let controller = require('./postController')

router.route('/')
  .get(controller.get)
  .post(controller.create)

router.route('/:id')
  .get(controller.getOne)
  .put(controller.update)

module.exports = router
