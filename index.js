const express = require('express')
const bodyParser = require('body-parser')
const config = require('./config/config.js')
let api = require('./api/api.js')
let app = express()

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')

// MIDDLEWARE
app.use(express.static('public'))
// api specific
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', api)

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`), function(err) {
    if (err) {
      res.status(500)
      res.send(err)
    }
  }
})

const port = config.port
app.listen(port, (err) => {
  if (err) {
    console.log('Err', err)
  }
  console.log(`Listening on port ${port}`)
})

module.exports = app
