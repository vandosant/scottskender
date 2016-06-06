const jwt = require('jsonwebtoken');
const User = require('../api/user/userModel');
const config = require('../config/config');

exports.signToken = function(id) {
  return jwt.sign({_id: id}, config.jwtSecret, {expiresIn: config.tokenExpiration});
}

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
	} else {
	  user.authenticate.call(user, password)
	    .then(function(isMatched) {
              if (!isMatched) {
                res.status(401).send('Invalid username or password');
	      } else {
                req.user = user;
		next();
	      }
	    })
	    .catch(function(err) {
              next(err);
	    })
	}
      }, function(err) {
        next(err);
      });
  };
};

exports.decodeToken = function() {
  return function(req, res, next) {
    if (!req.headers.authorization) {
      res.status(401).send('Unauthorized')
      return;
    };

    jwt.verify(req.headers.authorization.split(" ")[1], config.jwtSecret, function(err, decoded) {
      if (err || !decoded) {
        res.status(401).send('Unauthorized');
	return
      }
      req.user = decoded;
      next()
    })
  };
};

exports.verifyUser = function() {
  return function(req, res, next) {
    User.findById(req.user._id)
      .then(function(user) {
        if (!user) {
          res.status(401).send('Unauthorized');
	} else {
          req.user = user;
	  next();
	}
      }, function(err) {
        next(err);
      });
  }
};
