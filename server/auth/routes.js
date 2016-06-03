let router = require('express').Router();
const controller = require('./controller');
const verify = require('./auth').verify;

router.post('/signin', verify(), controller.signin);

module.exports = router;
