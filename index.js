let express = require('express')
let app = express()
let config = require('./config/config.js')

let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')

let Post = mongoose.model('Post', {title: String})
let firstPost = new Post({title: 'Another dev blurb'})
firstPost.save(function (err) {
  if (err) {
    console.log(err)
  }
})

app.use(express.static('public'));
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
