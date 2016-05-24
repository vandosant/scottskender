const React = require('react')
const ReactDOM = require('react-dom')
const Post = require('./postModel')
Post.load()

let App = React.createClass({
  render () {
    const style = {color: this.props.color}
    return (
      <div>
        <h1 style={style}>
          {this.props.title}
	</h1>
      </div>
    )
  }
})

ReactDOM.render(<App title='musings' color='#bf8415' />, document.getElementById('app'))
