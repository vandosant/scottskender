var express = require('express')
var app = express()

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`), function(err) {
    if (err) {
      res.status(500)
      res.send(err)
    }
  }
})

const port = 8000
app.listen(port, (err) => {
  if (err) {
    console.log('Err', err)
  }
  console.log(`Listening on port ${port}`)
})
