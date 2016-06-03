const config = require('./server/config/config')
const app = require('./server/server')

const port = config.port

app.listen(port, (err) => {
  if (err) {
    console.log('Err', err)
  }
  console.log(`Listening on port ${port}`)
})
