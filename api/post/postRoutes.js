let router = require('express').Router()
let postModel = require('./postModel')
let controller = require('./postController')
const decodeToken = require('../../auth/auth').decodeToken

router.route('/')
  .get(controller.get)
  .post(controller.create)

router.route('/:id')
  .get(controller.getOne)
  .put(controller.update)
  .delete(decodeToken(), controller.delete)

module.exports = router
