const React = require('react')
const Title = require('./Title')
const { Link } = require('react-router')
const { object } = React.PropTypes

let Landing = React.createClass({
  propTypes: {
    route: object
  },
  render() {
    return (
      <div>
        <Title title='Musings' color='#000' />
        {this.props.route.store.posts.map((post) => (
	  <Link to={`/posts/${post.title.replace(/\s/g, '-')}`}>
	    <div className='panel' key={post._id}>{post.title}</div>
	  </Link>
        ))}
      </div>
    )
  }
})

module.exports = Landing
