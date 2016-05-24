const React = require('react')
const ReactDOM = require('react-dom')
const Post = require('./postModel')
const Title = require('./Title')
Post.load()

const App = () => {
  return (
    <div>
      <Title title='musings' color='#bf8415' />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
