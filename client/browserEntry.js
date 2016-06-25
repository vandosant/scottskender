const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./App.jsx')
const store = require('./store')
ReactDOM.render(<App {...window.__PRELOADED_STATE__}/>, document.getElementById('app'))

