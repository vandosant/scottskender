const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config')
const api = require('./api/api');
const auth = require('./auth/routes');
let app = express();

require('mongoose').connect(config.db.url)

if (config.seed) {
  require('./util/seed')
}

require('../client/server')(app);

// api specific
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', api)
app.use('/auth', auth)


app.use(function (err, req, res, next) {
  if (err) {
    res.status(404).send(err.message);
  }
});

module.exports = app;
