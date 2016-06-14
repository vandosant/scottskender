const React = require('react')
const Title = require('./Title')

let Landing = React.createClass({
  render() {
    <div>
      <Title title='Musings' color='#000' />
      {this.props.posts.map((post) => { return (
	<div key={post._id} className='panel'><a href='#'>{post.title}</a></div> )
      } )}
    </div>
  }
})

module.exports = Landing
