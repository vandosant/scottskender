let express = require('express')
let app = express()
let config = require('./config/config.js')

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
