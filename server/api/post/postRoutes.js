let router = require('express').Router()
let postModel = require('./postModel')
let controller = require('./postController')
const auth = require('../../auth/auth')

router.route('/')
  .get(controller.get)
  .post(controller.create)

router.route('/:id')
  .get(controller.getOne)
  .put(controller.update)
  .delete(auth.decodeToken(), auth.verifyUser(), controller.delete)

module.exports = router
