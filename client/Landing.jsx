const React = require('react')
const Title = require('./Title')
const { object } = React.PropTypes

let Landing = React.createClass({
  propTypes: {
    store: object
  },
  render() {
    return (
      <div>
        <Title title='Musings' color='#000' />
        {this.props.store.posts.map((post) => (
	  <a key={post._id} href={`/posts/${post.title.replace(/\s/g, '-').toLowerCase()}`}>
	    <div className='panel' key={post._id}>{post.title}</div>
	  </a>
        ))}
      </div>
    )
  }
})

module.exports = Landing
