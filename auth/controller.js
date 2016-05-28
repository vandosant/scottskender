let User = require('../api/user/userModel');
const signToken = require('./auth').signToken;

exports.signin = function(req, res, next) {
  res.json(req.user);
};
