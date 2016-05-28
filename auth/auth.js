const User = require('../api/user/userModel');

exports.verify = function() {
  return function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
      res.status(400).send('Username and password required.')
      return;
    }

    User.findOne({username: username})
      .then(function(user) {
        if (!user) {
          res.status(401).send('Invalid username or password');
	}
      })
  };
};
