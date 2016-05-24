const React = require('react')
const ReactDOM = require('react-dom')
const Post = require('./postModel')
const Title = require('./Title')

Post.load()
.then(function(posts) {
  console.log(posts)
  const App = () => {
    return (
      <div>
        <Title title='musings' color='#bf8415' />
	{posts.map((post) => { return <div>{post.title}</div> } )}
      </div>
    )
  }

  ReactDOM.render(<App />, document.getElementById('app'))
})
