const React = require('react')
const Title = require('./Title')
const { array } = React.PropTypes

let Landing = React.createClass({
  propTypes: {
    posts: array
  },
  render() {
    return (
      <div>
        <Title title='Musings' color='#000' />
        {this.props.posts.map((post) => (
	  <a key={post._id} href={`/posts/${post.title.replace(/\s/g, '-').toLowerCase()}`}>
	    <div className='panel' key={post._id}>{post.title}</div>
	  </a>
        ))}
      </div>
    )
  }
})

module.exports = Landing
