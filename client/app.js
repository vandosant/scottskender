const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Landing')
const Posts = require('./postModel')
const Post = require('./Post')
let store = Object.create(null)
Posts.load()
.then(function(posts) {
  Object.assign(store, {posts: posts})
  const App = () => {
    return (
      <Landing store={store} />
    )
  }
  ReactDOM.render(<App store={store} />, document.getElementById('app'))
})
