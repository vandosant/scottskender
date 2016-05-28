let mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(next) {
  let user = this
  if (this.isModified('password')) {
    this.encryptPassword(this.password)
      .then(function(hashedPassword) {
        user.password = hashedPassword;
	return next();
      })
      .catch(function(err) {
	return next();
      })
  } else {
    next();
  }
})

UserSchema.methods = {
  encryptPassword(password) {
    const saltRounds = 10;
    return new Promise(function(resolve, reject) {
      if (!password) {
        resolve('')
	return;
      }
      bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
        if (err) {
          reject(err);
	} else {
          resolve(hashedPassword);
	}
      })
    })
  },
  authenticate(password) {
    const user = this
    return new Promise(function(resolve, reject) {
      bcrypt.compare(password, user.password, function(err, isMatched) {
        if (err) {
          reject(err);
	} else {
          resolve(isMatched);
	}
      })
    })
  }
}

module.exports = mongoose.model('user', UserSchema)
