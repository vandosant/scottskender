const React = require('react')
const ReactDOM = require('react-dom')
const Landing = require('./Landing')
const {Router, Route, hashHistory} = require('react-router')
const Posts = require('./postModel')
const Post = require('./Post')
let store = Object.create(null)
Posts.load()
.then(function(posts) {
  Object.assign(store, {posts: posts})
  const App = () => {
    function assignPost (nextState, replace) {
      const postArray = posts.filter((post) => post.title.replace(/\s/g, '-') === nextState.params.id)

      Object.assign(nextState.params, postArray[0])
    }
    return (
      <Router history={hashHistory}>
        <Route path='/' component={Landing} store={store} />
        <Route path='/posts/:id' component={Post} onEnter={assignPost} />
      </Router>
    )
  }
  ReactDOM.render(<App store={store} />, document.getElementById('app'))
})
