const React = require('react')
const ReactDOM = require('react-dom')
const Post = require('./postModel')
const Title = require('./Title')

Post.load()
.then(function(posts) {
  const App = () => {
    return (
      <div>
        <Title title='musings' color='#bf8415' />
	{posts.map((post) => { return (
				<div key={post._id} className='panel'>{post.title}</div> )
			     } )}
      </div>
    )
  }

  ReactDOM.render(<App />, document.getElementById('app'))
})
