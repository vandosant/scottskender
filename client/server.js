require('babel-register')

const express = require('express')
const path = require('path')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const fs = require('fs')
const baseTemplate = fs.readFileSync(path.join(__dirname, './views/index.html'))
const _ = require('lodash')
const template = _.template(baseTemplate)
const App = require('./App.jsx')
const store = require('./store')

module.exports = function(app) {
  app.use(express.static('public'))
  app.use('/posts', express.static('public'))
  
  app.get('/', (req, res) => {
    store.load()
    .then(function (store) {
      const body = ReactDOMServer.renderToString(
        React.createElement(App, store)
      )
      res.status(200).send(template({body, preloadedState: store}))
    })
    .catch(function (err) {
      res.status(500).send(err);
    });
  })
  
  app.get('/posts/:id', (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/views/post.html`)), function(err) {
      if (err) {
        res.status(500)
        res.send(err)
      }
    }
  })
}
