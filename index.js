let express = require('express')
let bodyParser = require('body-parser')
let app = express()
let config = require('./config/config.js')
let api = require('./api/api.js')

// DB STUFF
let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')

let PostSchema = new mongoose.Schema({
  title: String,
  body: {
    type: String,
    required: true
  }
})

let PostModel = mongoose.model('posts', PostSchema)
PostModel.create(
  {title: 'Another dev blurb', body: 'I am telling you some opinions here'}
).then(function(err, post) {
  console.log(err, post);
});

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
