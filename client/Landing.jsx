const React = require('react')
const Title = require('./Title')
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
	  <div className='panel' key={post._id}><a href='/'>{post.title}</a></div>
        ))}
      </div>
    )
  }
})

module.exports = Landing
