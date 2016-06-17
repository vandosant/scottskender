const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Landing')
const {Router, Route, hashHistory} = require('react-router')
const Posts = require('./postModel')

let store = Object.create(null)
Posts.load()
.then(function(posts) {
  Object.assign(store, {posts: posts})
  const App = () => {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={Landing} store={store} />
      </Router>
    )
  }
  ReactDOM.render(<App store={store} />, document.getElementById('app'))
})
