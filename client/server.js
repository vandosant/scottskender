const express = require('express')
const path = require('path')

module.exports = function(app) {
  app.use(express.static('public'))
  app.use('/posts', express.static('public'))
  
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../index.html`)), function(err) {
      if (err) {
        res.status(500)
        res.send(err)
      }
    }
  })
  
  app.get('/posts/:id', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../post.html`)), function(err) {
      if (err) {
        res.status(500)
        res.send(err)
      }
    }
  })
}
