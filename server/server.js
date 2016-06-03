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

// api specific
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', api)
app.use('/auth', auth)

// client specific
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../index.html`)), function(err) {
    if (err) {
      res.status(500)
      res.send(err)
    }
  }
})

app.use(function (err, req, res, next) {
  if (err) {
    res.status(404).send(err.message);
  }
});

module.exports = app;
