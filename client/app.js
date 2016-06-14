const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Landing')
const {Router, Route, hashHistory} = require('react-router')
const Posts = require('./postModel')

const App = () => {
  return (
    <Router history={hashHistory}>
      <Route path='/' component={Landing} />
    </Router>
  )
}

let store = Object.create(null)

Posts.load()
.then(function(posts) {
  store = Object.assign(posts)
  ReactDOM.render(<App store={store} />, document.getElementById('app'))
})
